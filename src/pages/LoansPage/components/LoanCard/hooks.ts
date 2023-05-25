import { BondOfferV2 } from 'fbonds-core/lib/fbond-protocol/types';
import { commonActions } from './../../../../state/common/actions';
import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN, web3 } from '@frakt-protocol/frakt-sdk';
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
  BASE_POINTS,
  BOND_DECIMAL_DELTA,
  useMarket,
  useMarketPairs,
} from '@frakt/utils/bonds';
import {
  getBestOrdersForExit,
  getBestOrdersForRefinance,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import {
  convertTakenOrdersToOrderParams,
  patchPairWithProtocolFee,
} from '@frakt/pages/BorrowPages/cartState';
import {
  fetchCertainMarket,
  fetchMarketPairs,
} from '@frakt/api/bonds/requests';
import { map, sum } from 'lodash';

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

  const [isRefinanceModalVisible, setRefinanceModalVisible] =
    useState<boolean>(false);

  const { market, pairs } = useLoanData(loan);

  const [bestOrders, setBestOrders] = useState(null);

  useEffect(() => {
    if (!pairs.length) return;

    const loanToValueBasePoints =
      (loan.loanValue / (market?.oracleFloor?.floor ?? 0)) * BASE_POINTS;

    const bestOrdersForRefinance = getBestOrdersForExit({
      bondOffers: pairs,
      loanToValueFilter: loanToValueBasePoints,
      amountOfBonds: loan.repayValue / BASE_POINTS,
    });

    setBestOrders(bestOrdersForRefinance);
  }, [pairs, loan, market]);

  const onRefinance = async (): Promise<void> => {
    try {
      openLoadingModal();

      console.log('BEST ORDERS FOR REFINANCE', bestOrders);
      const result = await refinanceLoan({
        wallet,
        connection,
        loan,
        market,
        bondOrderParams: convertTakenOrdersToOrderParams({
          pairs,
          takenOrders: bestOrders?.takenOrders || [],
        }),
      });
    } catch (error) {
      throwLogsError(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onRefinance,
    loadingModalVisible,
    isRefinanceModalVisible,
    bestLoanParams:
      {
        borrowed: bestOrders?.maxBorrowValue || 0,
        debt: sum(
          map(
            bestOrders?.takenOrders,
            ({ pricePerShare, orderSize }) =>
              (orderSize / pricePerShare) * BASE_POINTS,
          ),
        ),
      } || 0,
    openRefinanceModal: () => setRefinanceModalVisible(true),
    closeRefinanceModal: () => setRefinanceModalVisible(false),
  };
};

const useLoanData = (loan: Loan) => {
  //TODO: uncomment when done
  // const marketPubkey = '6bUAJarFDjdQ7fFEe8DWf99FwNzdnM1Xr2HrrbGVkjA1';\

  const marketPubkey = loan?.bondParams?.marketPubkey;

  const { market } = useMarket({ marketPubkey });

  const { pairs: rawPairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey,
  });

  const pairs = useMemo(() => {
    return isLoadingPairs ? [] : rawPairs;
  }, [isLoadingPairs]);

  return {
    market,
    pairs,
    isLoadingPairs,
  };
};
