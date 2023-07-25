import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN } from '@frakt-protocol/frakt-sdk';
import { map, sum } from 'lodash';

import { usePartialRepayModal } from '@frakt/components/PartialRepayModal';
import { stakeCardinal, unstakeCardinal } from '@frakt/utils/stake';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { Loan, RewardState, LoanType } from '@frakt/api/loans';
import { paybackLoans } from '@frakt/utils/loans/paybackLoans';
import { useConfetti } from '@frakt/components/Confetti';
import { paybackLoan } from '@frakt/utils/loans';
import { useIsLedger } from '@frakt/store';

import { useHiddenLoansPubkeys, useSelectedLoans } from '../../../loansState';

export const useLoansTransactions = (loan: Loan) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useConfetti();

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

  const showConfetti = () => setVisible(true);

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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onPartialPayback,
    onPayback,

    closePartialRepayModal,
    partialRepayModalVisible,
    loadingModalVisible,
    transactionsLeft,

    onCardinalStake,
    onCardinalUnstake,
  };
};

export const useBulkRepayTransaction = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useConfetti();

  const { addHiddenLoansPubkeys } = useHiddenLoansPubkeys();
  const { selection, clearSelection } = useSelectedLoans();

  const { isLedger } = useIsLedger();

  const showConfetti = () => setVisible(true);

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onBulkRepay = async (): Promise<void> => {
    try {
      openLoadingModal();

      const result = await paybackLoans({
        connection,
        wallet,
        loans: selection,
        isLedger,
      });

      if (result) {
        addHiddenLoansPubkeys(...selection.map(({ pubkey }) => pubkey));

        clearSelection();
        showConfetti();
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onBulkRepay,
    loadingModalVisible,
    totalBorrowed: sum(map(selection, ({ repayValue }) => repayValue / 1e9)),
  };
};
