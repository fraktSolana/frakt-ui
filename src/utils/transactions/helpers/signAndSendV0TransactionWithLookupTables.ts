import { web3 } from 'fbonds-core';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { TxnsAndSigners } from './signAndSendAllTransactionsInSequence';

export interface InstructionsAndSigners {
  instructions: web3.TransactionInstruction[];
  signers?: web3.Signer[];
  // lookupTable?: web3.PublicKey
}

type SignAndSendV0TransactionWithLookupTables = (props: {
  lookupTablePublicKeys: web3.PublicKey[];
  createLookupTableTxns: web3.Transaction[];
  extendLookupTableTxns: web3.Transaction[];

  v0InstructionsAndSigners: InstructionsAndSigners;

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
export const signAndSendV0TransactionWithLookupTables: SignAndSendV0TransactionWithLookupTables =
  async ({
    lookupTablePublicKeys,
    createLookupTableTxns,
    extendLookupTableTxns,
    v0InstructionsAndSigners,

    connection,
    wallet,
    commitment = 'confirmed',
    onBeforeApprove,
    onAfterSend,
    onSuccess,
    onError,
  }) => {
    try {
      const txnsAndSigners: TxnsAndSigners[][] = [
        createLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
        extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      ];
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

      let currentTxIndex = 0;
      for (let i = 0; i < txnsAndSigners.length; i++) {
        for (let r = 0; r < txnsAndSigners[i].length; r++) {
          console.log('currentTxIndex: ', currentTxIndex);
          const txn = signedTransactions[currentTxIndex];
          await connection.sendRawTransaction(txn.serialize(), {
            skipPreflight: false,
            preflightCommitment: 'processed',
          });
          currentTxIndex += 1;
        }
        if (txnsAndSigners[i].length > 0)
          await new Promise((r) => setTimeout(r, 7000));
      }

      onAfterSend?.();

      const lookupTables = await Promise.all(
        lookupTablePublicKeys.map(
          async (lookupTablePublicKey) =>
            (
              await connection.getAddressLookupTable(
                new web3.PublicKey(lookupTablePublicKey),
              )
            ).value,
        ),
      );

      const transactionsMessageV0 = new web3.VersionedTransaction(
        new web3.TransactionMessage({
          payerKey: wallet.publicKey,
          recentBlockhash: blockhash,
          instructions: v0InstructionsAndSigners.instructions,
        }).compileToV0Message([...lookupTables]),
      );

      transactionsMessageV0.sign([...v0InstructionsAndSigners.signers]);

      const signedTransactionsV0 = await wallet.signAllTransactions([
        transactionsMessageV0,
      ]);

      const txnSignatures = await Promise.all(
        signedTransactionsV0.map((signedTransaction) =>
          connection.sendTransaction(signedTransaction, { maxRetries: 5 }),
        ),
      );
      //   );
      await new Promise((r) => setTimeout(r, 7000));

      // //? Can't cover this shit with types properly
      // const resultsContainErr = results
      //   .map((res) => !!(res as any)?.value?.value?.err)
      //   .find(Boolean);

      // if (resultsContainErr) {
      //   throw new Error('Transaction contains error');
      // }

      onSuccess?.();

      return true;
    } catch (error) {
      onError?.(error);
      return false;
    }
  };
