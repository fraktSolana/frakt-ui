import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';

import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import {
  makeCreateBondTransaction,
  makeCreateBondMultiOrdersTransaction,
} from '@frakt/utils/bonds';
import { BondOrder } from '@frakt/pages/BorrowPages/cartState';
import { Pair } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { useConnection } from '@frakt/hooks';

import { useBorrow } from '../cartState';
import { BondOrderParams } from '@frakt/api/nft';
import {
  signAndSendAllTransactionsInSequence,
  TxnsAndSigners,
} from '../BorrowManualPage/components/Sidebar/hooks';

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

  //? Go to borrow root page if bulk selection doesn't exist
  useEffect(() => {
    if (history && !cartOrders.length) {
      history.replace(PATHS.BORROW_ROOT);
    }
  }, [history, cartOrders]);

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const onBorrow = async () => {
    try {
      closeConfirmModal();
      openLoadingModal();

      const result = await borrowBulk({
        orders: cartOrders,
        pairs: cartPairs,
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
      // eslint-disable-next-line no-console
      console.warn(error?.logs);
      console.error(error);
    } finally {
      closeLoadingModal();
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
    closeLoadingModal,
    onBulkEdit,
  };
};

type BorrowBulk = (props: {
  orders: BondOrder[];
  pairs: Pair[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

const borrowBulk: BorrowBulk = async ({
  orders,
  pairs,
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
        borrowValue: order.loanValue,
        connection,
        wallet,
      });
    }),
  );

  const firstChunk: TxnsAndSigners[] = [
    ...notBondTransactionsAndSigners,
    ...bondTransactionsAndSignersChunks
      .map((chunk) => chunk.createBondTxnAndSigners)
      .flat(),
  ];
  // await signAndSendAllTransactions({
  //   txnsAndSigners: firstChunk,
  //   connection,
  //   wallet,
  //   // commitment = 'finalized',
  //   onBeforeApprove: () => {},
  //   onAfterSend: () => {},
  //   onSuccess: () => {},
  //   onError: () => {},
  // });

  const secondChunk: TxnsAndSigners[] = [
    ...bondTransactionsAndSignersChunks
      .map((chunk) => chunk.sellingBondsTxnsAndSigners)
      .flat(),
  ];
  // await signAndSendAllTransactions({
  // txnsAndSigners: secondChunk,
  // connection,
  // wallet,
  // // commitment = 'finalized',
  // onBeforeApprove: () => {},
  // onAfterSend: () => {},
  // onSuccess: () => {},
  // onError: () => {},
  // });

  await signAndSendAllTransactionsInSequence({
    txnsAndSigners: [firstChunk, secondChunk],
    connection,
    wallet,
    // commitment = 'finalized',
    onBeforeApprove: () => {},
    onAfterSend: () => {},
    onSuccess: () => {},
    onError: () => {},
  });

  return true;
};
