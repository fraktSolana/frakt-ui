import { useMarket, useMarketPair } from './../../../../utils/bonds/hooks';
import { commonActions } from './../../../../state/common/actions';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@frakt-protocol/frakt-sdk';
import { useDispatch } from 'react-redux';

import { usePartialRepayModal } from '@frakt/components/PartialRepayModal';
import { stakeCardinal, unstakeCardinal } from '@frakt/utils/stake';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { Loan, RewardState, LoanType } from '@frakt/api/loans';
import { paybackLoan, refinanceLoan } from '@frakt/utils/loans';
import { throwLogsError } from '@frakt/utils';
import { useConnection } from '@frakt/hooks';

import { useHiddenLoansPubkeys, useSelectedLoans } from '../../loansState';
import {
  getMarketAndPairsByBond,
  getMarketAndPairsByLoan,
} from '@frakt/pages/MarketsPage/components/BondsOverview/components/BondsTable/helpers';
import { getBestOrdersForRefinance } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { BASE_POINTS, pairLoanDurationFilter } from '@frakt/utils/bonds';
import { getBestOrdersForExit } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import { convertTakenOrdersToOrderParams } from '@frakt/pages/BorrowPages/cartState';

export const useLoanCard = (loan: Loan) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const { addHiddenLoansPubkeys } = useHiddenLoansPubkeys();
  const { clearSelection } = useSelectedLoans();

  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const isStaked =
    loan?.classicParams?.rewards?.stakeState === RewardState.STAKED;

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const {
    visible: partialRepayModalVisible,
    open: openPartialRepayModal,
    close: closePartialRepayModal,
  } = usePartialRepayModal();

  const removeTokenOptimistic = (pubkey: string) => {
    addHiddenLoansPubkeys(pubkey);
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onPartialPayback = async (
    paybackAmount: BN,
    partialPercent: number,
  ) => {
    try {
      closePartialRepayModal();

      const isFullPayback = partialPercent === 100;

      if (isStaked && isFullPayback) {
        await onCardinalUnstake();
      }

      setTransactionsLeft(null);
      openLoadingModal();

      const result = await paybackLoan({
        connection,
        wallet,
        loan,
        paybackAmount,
      });

      if (!result) {
        throw new Error('Payback failed');
      }
      clearSelection();
      showConfetti();
      if (isFullPayback) {
        removeTokenOptimistic(loan.pubkey);
      }
    } catch (error) {
      throwLogsError(error);
    } finally {
      setTransactionsLeft(null);
      closeLoadingModal();
    }
  };

  const onCardinalUnstake = async () => {
    try {
      const { pubkey, nft } = loan;

      openLoadingModal();

      await unstakeCardinal({
        connection,
        wallet,
        nftMint: nft.mint,
        loan: pubkey,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setTransactionsLeft(null);
      closeLoadingModal();
    }
  };

  const onPayback = async () => {
    try {
      const { loanType, gracePeriod } = loan;

      if (loanType === LoanType.PRICE_BASED && !gracePeriod) {
        openPartialRepayModal();
        return;
      }

      if (isStaked) {
        await onCardinalUnstake();
      }

      openLoadingModal();

      const result = await paybackLoan({
        connection,
        wallet,
        loan,
      });

      if (!result) {
        throw new Error('Payback failed');
      }

      clearSelection();
      showConfetti();
      removeTokenOptimistic(loan.pubkey);
    } catch (error) {
      throwLogsError(error);
    } finally {
      setTransactionsLeft(null);
      closeLoadingModal();
    }
  };

  const onCardinalStake = async (): Promise<void> => {
    try {
      const { pubkey, nft } = loan;

      openLoadingModal();

      const result = await stakeCardinal({
        connection,
        wallet,
        nftMint: nft.mint,
        loan: pubkey,
      });

      if (!result) {
        throw new Error('Staking failed');
      }
    } catch (error) {
      throwLogsError(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onPartialPayback,
    closePartialRepayModal,
    partialRepayModalVisible,
    onPayback,
    onCardinalStake,
    onCardinalUnstake,
    closeLoadingModal,
    loadingModalVisible,
    transactionsLeft,
  };
};

export const useLoanTransactions = ({ loan }: { loan: Loan }) => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();
  const { pairs, market } = getMarketAndPairsByLoan(loan);

  const ltvBasePoints =
    (loan.loanValue / market?.oracleFloor?.floor || 0) * BASE_POINTS;

  const bestOrdersForRefinance = getBestOrdersForExit({
    bondOffers: pairs?.length ? pairs : [],
    loanToValueFilter: ltvBasePoints,
    amountOfBonds: loan.repayValue / BASE_POINTS + 5000, //TODO: create method to get best orders for refinance or find way to calculate amountOfBonds as param for getBestOrdersForExit
  });

  const onRefinance = async (): Promise<void> => {
    try {
      openLoadingModal();

      const result = await refinanceLoan({
        wallet,
        connection,
        loan,
        market,
        bondOrderParams: convertTakenOrdersToOrderParams({
          pairs,
          takenOrders: bestOrdersForRefinance.takenOrders,
        }),
      });
    } catch (error) {
      throwLogsError(error);
    } finally {
      closeLoadingModal();
    }
  };

  return { onRefinance };
};
