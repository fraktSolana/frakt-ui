import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { CartOrder, useBorrow } from '@frakt/pages/BorrowPages/cartState';
import { useLoadingModalState } from '@frakt/components/LoadingModal';
import { borrowBulk } from '@frakt/pages/BorrowPages/helpers';

export const useSidebar = () => {
  const {
    isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    currentBondOrderParams,
    currentLoanType,
    currentLoanValue,
    clearCart,
    clearCurrentNftState,
    cartOrders,
  } = useBorrow();

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();

  const connection = useConnection();
  const wallet = useWallet();

  const {
    visible: loadingModalVisible,
    setVisible: setLoadingModalVisible,
    clearState: clearLoadingModalState,
  } = useLoadingModalState();

  const onSubmit = async () => {
    try {
      //TODO closeConfirmModal();

      setLoadingModalVisible(true);

      const currentOrder: CartOrder = {
        borrowNft: currentNft,
        loanType: currentLoanType,
        loanValue: currentLoanValue,
        bondOrderParams: currentBondOrderParams,
      };

      const orders: CartOrder[] = [currentOrder, ...cartOrders];

      const result = await borrowBulk({
        orders,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Borrow failed');
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
    loadingModalVisible,
    setLoadingModalVisible,
  };
};
