import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';

import { useHistory } from 'react-router-dom';
import { makeDeposit } from './makeDeposit';

export const useDeposit = () => {
  const history = useHistory();

  const wallet = useWallet();

  const connection = useConnection();

  const secret = '36LiwBuWy3TvNrl4';

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const onCreateInvestment = async () => {
    if (wallet?.publicKey?.toBase58()) {
      try {
        openLoadingModal();

        const { investment, transaction, signers } = await makeDeposit({
          connection,
          amountToDeposit: 1,
          wallet,
          tradePool: '1',
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.MY_STRATEGIES}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error?.logs);
        console.error(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      } finally {
        closeLoadingModal();
      }
    }
  };

  return {
    onCreateInvestment,
    loadingModalVisible,
    closeLoadingModal,
  };
};
