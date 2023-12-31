import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { sum, map } from 'lodash';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import { paybackLoans } from '@frakt/utils/loans/paybackLoans';
import {
  useSelectedLoans,
  useHiddenLoansPubkeys,
} from '@frakt/pages/LoansPage/loansState';
import { useConfetti } from '@frakt/components/Confetti';
import { useIsLedger } from '@frakt/store';

export const useActiveLoans = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useConfetti();

  const { selection, clearSelection } = useSelectedLoans();
  const { addHiddenLoansPubkeys } = useHiddenLoansPubkeys();

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const { isLedger, setIsLedger } = useIsLedger();

  const showConfetti = () => setVisible(true);

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
    isLedger,
    setIsLedger,
    loadingModalVisible,
    closeLoadingModal,
    totalBorrowed: sum(map(selection, ({ repayValue }) => repayValue / 1e9)),
  };
};
