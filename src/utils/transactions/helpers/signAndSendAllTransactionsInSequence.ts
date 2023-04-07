import { web3 } from 'fbonds-core';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

type SignAndSendAllTransactionsInSequence = (props: {
  txnsAndSigners: TxnsAndSigners[][];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => Promise<boolean>;

//? Sequence means that transactions will be signed at once, but will be sent in a sequence by chunks.
//? F.e. txnsAndSigners: [[x, x, x], [y, y, y], [z, z, z]]. Sign all txns at once. But first send [x, x, x], wait for confirmation, send [y, y, y] wait for confirmation, send [z, z, z]
//? It needs when transactions from next chunk are related to transactions from previos chunk
export const signAndSendAllTransactionsInSequence: SignAndSendAllTransactionsInSequence =
  async ({
    txnsAndSigners,
    connection,
    wallet,
    commitment = 'confirmed',
    onBeforeApprove,
    onAfterSend,
    onSuccess,
    onError,
  }) => {
    try {
      //? Filter empty arrays from two-dimensional array
      const txnsAndSignersFiltered = txnsAndSigners.filter(
        (arr) => !!arr.length,
      );

      onBeforeApprove?.();

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transactionsFlatArr = txnsAndSignersFiltered
        .flat()
        .map(({ transaction, signers = [] }) => {
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = wallet.publicKey;

          if (signers.length) {
            transaction.sign(...signers);
          }

          return transaction;
        });

      const signedTransactions = await wallet.signAllTransactions(
        transactionsFlatArr,
      );

      const allTxnSignatures: Array<string> = [];

      let txnToSendIdxInFlatArr = 0;
      for (let chunk = 0; chunk < txnsAndSignersFiltered.length; chunk++) {
        const iterationSignatures: Array<string> = [];

        for (
          let txnIdxInChunk = 0;
          txnIdxInChunk < txnsAndSignersFiltered[chunk].length;
          txnIdxInChunk++
        ) {
          const txn = signedTransactions[txnToSendIdxInFlatArr];
          txnToSendIdxInFlatArr++;
          const signature = await connection.sendRawTransaction(
            txn.serialize(),
            {
              skipPreflight: true,
            },
          );
          iterationSignatures.push(signature);
          allTxnSignatures.push(signature);
        }

        await Promise.allSettled(
          iterationSignatures.map((signature) =>
            connection.confirmTransaction(
              {
                signature,
                blockhash,
                lastValidBlockHeight,
              },
              'confirmed',
            ),
          ),
        );
      }

      onAfterSend?.();

      const results = await Promise.allSettled(
        allTxnSignatures.map((signature) =>
          connection.confirmTransaction(
            {
              signature,
              blockhash,
              lastValidBlockHeight,
            },
            commitment,
          ),
        ),
      );

      //? Can't cover this shit with types properly
      const resultsContainErr = results
        .map((res) => !!(res as any)?.value?.value?.err)
        .find(Boolean);

      if (resultsContainErr) {
        throw new Error('Transaction contains error');
      }

      onSuccess?.();

      return true;
    } catch (error) {
      onError?.(error);
      return false;
    }
  };
