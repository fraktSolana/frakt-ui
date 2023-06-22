import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { Dictionary } from 'lodash';

import { PATHS } from '@frakt/constants';
import { calcPriceBasedMaxLoanValue } from '@frakt/pages/BorrowPages/cartState';
import { useLoadingModalState } from '@frakt/components/LoadingModal';
import { LoanType } from '@frakt/api/loans';
import { BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import { LiteOrder, borrow } from './helpers';

interface UseSidebarProps {
  loanType: LoanType;
  totalBorrowValue: number;
  isBulk: boolean;
  currentNft: BorrowNft;
  onNftClick: (nft: BorrowNft) => void;
  clearCart: () => void;
  cartNfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>;
  resetCache: () => void;
}

export const useSidebar = ({
  loanType,
  totalBorrowValue,
  isBulk,
  currentNft,
  onNftClick,
  clearCart,
  cartNfts,
  orderParamsByMint,
  resetCache,
}: UseSidebarProps) => {
  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const [isLedger, setIsLedger] = useState<boolean>(false);

  const history = useHistory();

  const { connection } = useConnection();
  const wallet = useWallet();

  const {
    visible: loadingModalVisible,
    setVisible: setLoadingModalVisible,
    clearState: clearLoadingModalState,
  } = useLoadingModalState();

  const onSubmit = async () => {
    try {
      setLoadingModalVisible(true);

      const orders: LiteOrder[] = cartNfts.map((nft) => {
        const isBond = loanType === LoanType.BOND;

        return {
          borrowNft: nft,
          loanType: loanType,
          loanValue: isBond
            ? orderParamsByMint[nft.mint].loanValue
            : calcPriceBasedMaxLoanValue({ nft }),
          bondOrderParams: isBond ? orderParamsByMint[nft.mint].orders : null,
        };
      });

      const result = await borrow({
        orders: orders,
        isLedger,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Borrow failed');
      }

      history.push(PATHS.BORROW_SUCCESS);

      resetCache();
      clearCart();
    } catch (error) {
      console.error(error);
    } finally {
      clearLoadingModalState();
    }
  };

  return {
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    loadingModalVisible,
    setLoadingModalVisible,
    currentNft,
    onNftClick,
    isBulk,
    totalBorrowValue,
    isLedger,
    setIsLedger,
  };
};
