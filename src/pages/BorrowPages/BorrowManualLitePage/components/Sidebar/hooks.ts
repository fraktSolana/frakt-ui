import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { PATHS } from '@frakt/constants';
import { useConnection } from '@frakt/hooks';
import { calcPriceBasedMaxLoanValue } from '@frakt/pages/BorrowPages/cartState';
import { useLoadingModalState } from '@frakt/components/LoadingModal';
import { borrowBulk } from '@frakt/pages/BorrowPages/helpers';
import { useBorrowManualLitePage } from '../../BorrowManualLitePage';
import { LoanType } from '@frakt/api/loans';

interface UseSidebarProps {
  loanType: LoanType;
  totalBorrowValue: number;
  isBulk: boolean;
}

export const useSidebar = ({
  loanType,
  totalBorrowValue,
  isBulk,
}: UseSidebarProps) => {
  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const { currentNft, onNftClick, clearCart, cartNfts, orderParamsByMint } =
    useBorrowManualLitePage();

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
      setLoadingModalVisible(true);

      const orders = cartNfts.map((nft) => {
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

      const result = await borrowBulk({
        orders: orders as any, //TODO AddMarkets here
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Borrow failed');
      }

      history.push(PATHS.BORROW_SUCCESS);
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
  };
};
