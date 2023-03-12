import { useState } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import { PATHS } from '@frakt/constants';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import {
  makeCreateBondMultiOrdersTransaction,
  makeCreateBondTransaction,
} from '@frakt/utils/bonds';
import { useConnection } from '@frakt/hooks';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';
import { Market, Pair } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { BondOrderParams, BorrowNft } from '@frakt/api/nft';

export const useSidebar = () => {
  const {
    isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    currentPair,
    currentBondOrder,
    market,
    currentLoanType,
    currentLoanValue,
    saveUpcomingOrderToCart,
    clearCart,
    clearCurrentNftState,
  } = useBorrow();

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();
  const goToBulkOverviewPage = () => history.push(PATHS.BORROW_BULK_OVERVIEW);
  const goToToBorrowSuccessPage = () => {
    clearCart();
    clearCurrentNftState();
    history.push(PATHS.BORROW_SUCCESS);
  };

  const connection = useConnection();
  const wallet = useWallet();

  const onSubmit = async () => {
    if (isBulk) {
      saveUpcomingOrderToCart();
      return goToBulkOverviewPage();
    }

    try {
      const result = await borrowSingle({
        nft: currentNft,
        pair: currentPair,
        // bondOrderParamsAndAssetReceiver: currentBondOrder.bondOrderParams.orderParams.map(orderParam => ({...orderParam, assetReceiver: })),
        bondOrderParams: currentBondOrder
          ? currentBondOrder.bondOrderParams.orderParams
          : [],
        loanType: currentLoanType,
        loanValue: currentLoanValue,
        market,
        wallet,
        connection,
      });
      if (!result) {
        throw new Error('Error');
      }
      goToToBorrowSuccessPage();
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-console
      console.warn(error.logs?.join('\n'));
    }
  };

  return {
    isLoading: currentNft?.bondParams?.marketPubkey && isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
  };
};

type BorrowSingle = (props: {
  nft: BorrowNft;
  pair?: Pair;
  bondOrderParams?: BondOrderParams[];
  market?: Market;
  loanType: LoanType;
  loanValue: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

const borrowSingle: BorrowSingle = async ({
  nft,
  pair,
  bondOrderParams,
  market,
  loanType,
  loanValue,
  connection,
  wallet,
}): Promise<boolean> => {
  // console.log("bondOrderParams: ", bondOrderParams)
  if (loanType !== LoanType.BOND) {
    const { transaction, signers } = await makeProposeTransaction({
      nftMint: nft.mint,
      valuation: nft.valuation,
      loanValue: loanValue,
      loanType: loanType,
      connection,
      wallet,
    });
    return await signAndSendAllTransactions({
      txnsAndSigners: [{ transaction, signers }],
      connection,
      wallet,
      // commitment = 'finalized',
      onBeforeApprove: () => {},
      onAfterSend: () => {},
      onSuccess: () => {},
      onError: () => {},
    });
  }

  console.log('nft.valuation: ', nft.valuation);

  const { createBondTxnAndSigners, sellingBondsTxnsAndSigners } =
    await makeCreateBondMultiOrdersTransaction({
      nftMint: nft.mint,
      market,
      bondOrderParams: bondOrderParams,
      borrowValue: loanValue,
      connection,
      wallet,
    });

  console.log('signAndSendAllTransactionsInSequence');

  await signAndSendAllTransactionsInSequence({
    txnsAndSigners: [[createBondTxnAndSigners], sellingBondsTxnsAndSigners],
    connection,
    wallet,
    // commitment = 'finalized',
    onBeforeApprove: () => {},
    onAfterSend: () => {},
    onSuccess: () => {},
    onError: () => {},
  });
};

export interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

interface SignAndSendAllTransactionsProps {
  txnsAndSigners: TxnsAndSigners[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignAndSendAllTransactions = (
  props: SignAndSendAllTransactionsProps,
) => Promise<boolean>;

export const signAndSendAllTransactions: SignAndSendAllTransactions = async ({
  txnsAndSigners,
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  onError,
}) => {
  try {
    onBeforeApprove?.();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactions = txnsAndSigners.map(({ transaction, signers = [] }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      if (signers.length) {
        transaction.sign(...signers);
      }

      return transaction;
    });

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txnSignatures = await Promise.all(
      signedTransactions.map((txn) =>
        connection.sendRawTransaction(txn.serialize(), {
          skipPreflight: false,
        }),
      ),
    );

    console.log('Transactions sent!');
    notify({
      message: 'transaction sent!',
      type: NotifyType.INFO,
    });

    onAfterSend?.();

    // await Promise.allSettled(
    //   txnSignatures.map((signature) =>
    //     connection.confirmTransaction(
    //       {
    //         signature,
    //         blockhash,
    //         lastValidBlockHeight,
    //       },
    //       commitment,
    //     ),
    //   ),
    // );

    await new Promise((r) => setTimeout(r, 5000));

    onSuccess?.();
    notify({
      message: 'Borrowed successfully!',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error.logs?.join('\n'));
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'The transaction just failed :( Give it another try',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'proposeSingleLoanWithBonds',
    });

    return false;
  }
};

interface SignAndSendAllTransactionsInSequenceProps {
  txnsAndSigners: TxnsAndSigners[][];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignAndSendAllTransactionsInSequence = (
  props: SignAndSendAllTransactionsInSequenceProps,
) => Promise<boolean>;

export const signAndSendAllTransactionsInSequence: SignAndSendAllTransactionsInSequence =
  async ({
    txnsAndSigners,
    connection,
    wallet,
    commitment = 'finalized',
    onBeforeApprove,
    onAfterSend,
    onSuccess,
    onError,
  }) => {
    try {
      onBeforeApprove?.();

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transactions = txnsAndSigners
        .flat()
        .map(({ transaction, signers = [] }) => {
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = wallet.publicKey;

          if (signers.length) {
            transaction.sign(...signers);
          }

          return transaction;
        });

      console.log('txnsAndSigners: ', txnsAndSigners);
      console.log('transactions: ', transactions);

      const signedTransactions = await wallet.signAllTransactions(transactions);

      let currentTxIndex = 0;
      for (let i = 0; i < txnsAndSigners.length; i++) {
        for (let r = 0; r < txnsAndSigners[i].length; r++) {
          console.log('currentTxIndex: ', currentTxIndex);
          const txn = signedTransactions[currentTxIndex];
          await connection.sendRawTransaction(txn.serialize(), {
            skipPreflight: false,
          });
          currentTxIndex += 1;
        }
        await new Promise((r) => setTimeout(r, 6000));
      }

      console.log('Transactions sent!');
      notify({
        message: 'transaction sent!',
        type: NotifyType.INFO,
      });

      onAfterSend?.();

      // await Promise.allSettled(
      //   txnSignatures.map((signature) =>
      //     connection.confirmTransaction(
      //       {
      //         signature,
      //         blockhash,
      //         lastValidBlockHeight,
      //       },
      //       commitment,
      //     ),
      //   ),
      // );

      await new Promise((r) => setTimeout(r, 5000));

      onSuccess?.();
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
      });

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error.logs?.join('\n'));
      const isNotConfirmed = showSolscanLinkNotification(error);

      if (!isNotConfirmed) {
        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      }

      captureSentryError({
        error,
        wallet,
        transactionName: 'proposeSingleLoanWithBonds',
      });

      return false;
    }
  };
