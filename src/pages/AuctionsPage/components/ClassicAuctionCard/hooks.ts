import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import { AuctionListItem } from '@frakt/api/raffle';
import { buyAuction } from '@frakt/utils/raffles';

export const useClassicAuctionCard = (
  auction: AuctionListItem,
  hideAuction: (value: string) => void,
) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onSubmit = async (): Promise<void> => {
    openLoadingModal();

    try {
      const { nftMint, classicParams } = auction;
      const raffleAddress = classicParams?.auctionPubkey;

      const result = await buyAuction({
        connection,
        wallet,
        nftMint,
        raffleAddress,
      });

      if (result) {
        hideAuction(nftMint);
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return { onSubmit, loadingModalVisible };
};
