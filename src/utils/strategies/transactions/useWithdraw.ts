import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { logTxnError, notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';

import { makeWithdraw } from './makeWithdraw';

type UseWithdraw = (props: {
  tradePool: string;
  amountToUnstake: string;
  onCancel: () => void;
  onClearDepositValue: () => void;
}) => {
  onWithdraw: () => void;
};

export const useWithdraw: UseWithdraw = ({
  tradePool,
  amountToUnstake,
  onCancel,
  onClearDepositValue,
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const onWithdraw = async () => {
    if (wallet.publicKey) {
      try {
        const { transaction, signers } = await makeWithdraw({
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
      } catch (error) {
        logTxnError(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
        onCancel();
      } finally {
        onCancel();
      }
    }
  };

  return {
    onWithdraw,
  };
};
