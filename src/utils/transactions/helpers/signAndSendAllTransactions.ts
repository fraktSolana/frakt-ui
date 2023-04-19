import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

interface SignAndSendAllTransactionsProps {
  transactionsAndSigners: TxnsAndSigners[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

type SignAndSendAllTransactions = (
  props: SignAndSendAllTransactionsProps,
) => Promise<boolean>;

export const signAndSendAllTransactions: SignAndSendAllTransactions = async ({
  transactionsAndSigners,
  connection,
  wallet,
  commitment = 'confirmed',
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  onError,
}) => {
  try {
    onBeforeApprove?.();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash(commitment);

    const transactions = transactionsAndSigners.map(
      ({ transaction, signers }) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet?.publicKey;
        if (signers.length) {
          transaction.sign(...signers);
        }

        return transaction;
      },
    );

    const signedTransactions = await wallet?.signAllTransactions(transactions);

    const txids = await Promise.all(
      signedTransactions.map((signedTransaction) =>
        connection.sendRawTransaction(signedTransaction.serialize()),
      ),
    );

    onAfterSend?.();

    // await Promise.all(
    //   txids.map((txid) =>
    //     connection.confirmTransaction({
    //       signature: txid,
    //       blockhash,
    //       lastValidBlockHeight,
    //     }),
    //   ),
    // );
    await new Promise((r) => setTimeout(r, 7000));

    onSuccess?.();

    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
};
