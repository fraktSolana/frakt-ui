import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModalState } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';

import { useBorrow } from '../cartState';
import { borrowBulk } from '../helpers';

export const useBorrowBulkOverviewPage = () => {
  const history = useHistory();
  const wallet = useWallet();
  const { connection } = useConnection();
  const {
    cartOrders,
    cartPairs,
    setCurrentNftFromOrder,
    clearCart,
    clearCurrentNftState,
  } = useBorrow();

  const [isLedger, setIsLedger] = useState<boolean>(false);

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
        isLedger,
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
    isLedger,
    setIsLedger,
    setLoadingModalVisible,
    loadingModalTextStatus,
  };
};
