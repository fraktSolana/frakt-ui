import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@frakt/hooks';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';

import { makeDeposit } from './makeDeposit';

type UseDeposit = (props: {
  tradePool: string;
  amountToDeposit: string;
  onCancel: () => void;
  onClearDepositValue: () => void;
}) => {
  onCreateInvestment: () => void;
};

export const useDeposit: UseDeposit = ({
  tradePool,
  amountToDeposit,
  onCancel,
  onClearDepositValue,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

  const onCreateInvestment = async () => {
    if (wallet.publicKey) {
      try {
        const { transaction, signers } = await makeDeposit({
          connection,
          amountToDeposit,
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
        // eslint-disable-next-line no-console
        console.warn(error?.logs);
        console.error(error);

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
    onCreateInvestment,
  };
};
