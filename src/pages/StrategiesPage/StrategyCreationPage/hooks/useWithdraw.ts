import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';

import { useHistory } from 'react-router-dom';

import { makeWithdraw } from './makeWithdraw';

export const useWithdraw = ({
  tradePool,
  amountToUnstake,
  onCancel,
  onClearDepositValue,
}: any) => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const onWithdraw = async () => {
    if (wallet.publicKey) {
      try {
        openLoadingModal();

        const { investment, transaction, signers } = await makeWithdraw({
          connection,
          amountToUnstake,
          wallet,
          tradePool,
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });
        onClearDepositValue();

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });
        onCancel();
        history.go(0);
        // history.push(`${PATHS.MY_STRATEGIES}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error?.logs);
        console.error(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
        onCancel();
      } finally {
        closeLoadingModal();
        onCancel();
      }
    }
  };

  return {
    onWithdraw,
    loadingModalVisible,
    closeLoadingModal,
  };
};
