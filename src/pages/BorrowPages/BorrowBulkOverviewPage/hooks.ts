import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';

import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModalState } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { makeCreateBondMultiOrdersTransaction } from '@frakt/utils/bonds';
import { CartOrder } from '@frakt/pages/BorrowPages/cartState';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { useConnection } from '@frakt/hooks';
import {
  InstructionsAndSigners,
  showSolscanLinkNotification,
  signAndSendAllTransactionsInSequence,
  signAndSendV0TransactionWithLookupTables,
  TxnsAndSigners,
} from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';

import { useBorrow } from '../cartState';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from '@frakt/utils/transactions/helpers/signAndSendV0TransactionWithLookupTablesSeparateSignatures';

export const useBorrowBulkOverviewPage = () => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();
  const {
    cartOrders,
    cartPairs,
    setCurrentNftFromOrder,
    clearCart,
    clearCurrentNftState,
  } = useBorrow();

  const [isSupportSignAllTxns, setIsSupportSignAllTxns] =
    useState<boolean>(true);

  const {
    visible: loadingModalVisible,
    setVisible: setLoadingModalVisible,
    textStatus: loadingModalTextStatus,
    clearState: clearLoadingModalState,
  } = useLoadingModalState();

  //? Go to borrow root page if bulk selection doesn't exist
  useEffect(() => {
    if (history && !cartOrders.length) {
      history.replace(PATHS.BORROW_ROOT);
    }
  }, [history, cartOrders]);

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const onBorrow = async () => {
    try {
      closeConfirmModal();
      setLoadingModalVisible(true);

      const result = await borrowBulk({
        orders: cartOrders,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      history.push(PATHS.BORROW_SUCCESS);
      clearCurrentNftState();
      clearCart();
    } catch (error) {
      console.error(error);
    } finally {
      clearLoadingModalState();
    }
  };

  const onBackBtnClick = () => history.goBack();

  const onBulkEdit = (mint?: string) => {
    if (mint) {
      setCurrentNftFromOrder(mint);
    } else {
      setCurrentNftFromOrder(cartOrders[0]?.borrowNft?.mint);
    }
    history.push(PATHS.BORROW_MANUAL);
  };

  return {
    cartOrders,
    cartPairs,
    onBackBtnClick,
    onBorrow,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
    loadingModalVisible,
    onBulkEdit,
    isSupportSignAllTxns,
    setIsSupportSignAllTxns,
    setLoadingModalVisible,
    loadingModalTextStatus,
  };
};

type BorrowBulk = (props: {
  orders: CartOrder[];
  connection: web3.Connection;
  wallet: WalletContextState;
  isSupportSignAllTxns?: boolean;
}) => Promise<boolean>;

const borrowBulk: BorrowBulk = async ({
  orders,
  connection,
  wallet,
}): Promise<boolean> => {
  const notBondOrders = orders.filter(
    (order) => order.loanType !== LoanType.BOND,
  );
  const notBondTransactionsAndSigners = await Promise.all(
    notBondOrders.map((order) => {
      return makeProposeTransaction({
        nftMint: order.borrowNft.mint,
        valuation: order.borrowNft.valuation,
        loanValue: order.loanValue,
        loanType: order.loanType,
        connection,
        wallet,
      });
    }),
  );
  const bondOrders = orders.filter((order) => order.loanType === LoanType.BOND);

  const bondTransactionsAndSignersChunks = await Promise.all(
    bondOrders.map((order) => {
      return makeCreateBondMultiOrdersTransaction({
        nftMint: order.borrowNft.mint,
        market: order.bondOrderParams.market,
        bondOrderParams: order.bondOrderParams.orderParams,
        connection,
        wallet,
      });
    }),
  );

  const firstChunk: TxnsAndSigners[] = [
    ...notBondTransactionsAndSigners,
    ...bondTransactionsAndSignersChunks
      .map((chunk) => ({
        transaction: chunk.createLookupTableTxn,
        signers: [],
      }))
      .flat(),
  ];

  const secondChunk: TxnsAndSigners[] = [
    ...bondTransactionsAndSignersChunks
      .map((chunk) =>
        chunk.extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      )
      .flat(),
  ];

  const createAndSellBondsIxsAndSignersChunk: InstructionsAndSigners[] = [
    ...bondTransactionsAndSignersChunks
      .map((chunk) => chunk.createAndSellBondsIxsAndSigners)
      .flat(),
  ];

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    createLookupTableTxns: firstChunk.map((txn) => txn.transaction),
    extendLookupTableTxns: secondChunk.map((txn) => txn.transaction),
    v0InstructionsAndSigners: createAndSellBondsIxsAndSignersChunk,
    // lookupTablePublicKey: bondTransactionsAndSignersChunks,
    connection,
    wallet,
    commitment: 'confirmed',
    onAfterSend: () => {
      notify({
        message: 'Transactions sent!',
        type: NotifyType.INFO,
      });
    },
    onSuccess: () => {
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
      });
    },
    onError: (error) => {
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
        transactionName: 'borrowBulk',
      });
    },
  });
};
