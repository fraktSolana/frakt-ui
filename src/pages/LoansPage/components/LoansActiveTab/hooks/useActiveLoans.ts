import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { sum, map } from 'lodash';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import { paybackLoans } from '@frakt/utils/loans/paybackLoans';
import { commonActions } from '@frakt/state/common/actions';
import { throwLogsError } from '@frakt/utils';
import { useConnection } from '@frakt/hooks';
import {
  useSelectedLoans,
  useHiddenLoansPubkeys,
} from '@frakt/pages/LoansPage/loansState';

export const useActiveLoans = () => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const { selection, clearSelection } = useSelectedLoans();
  const { addHiddenLoansPubkeys } = useHiddenLoansPubkeys();

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const showConfetti = () =>
    dispatch(commonActions.setConfetti({ isVisible: true }));

  const onBulkRepay = async (): Promise<void> => {
    try {
      openLoadingModal();

      const result = await paybackLoans({
        connection,
        wallet,
        loans: selection,
      });

      if (result) {
        addHiddenLoansPubkeys(...selection.map(({ pubkey }) => pubkey));

        clearSelection();
        showConfetti();
      }
    } catch (error) {
      throwLogsError(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onBulkRepay,
    loadingModalVisible,
    closeLoadingModal,
    totalBorrowed: sum(map(selection, ({ loanValue }) => loanValue / 1e9)),
  };
};
