import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useLoadingModal } from '@frakt/components/LoadingModal';

export const useAuctionCard = (
  auction: any, // TODO: Add interface
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
      //TODO: Implement request logic

      //? After successful submission
      hideAuction(auction?.mint);
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onSubmit,
    loadingModalVisible,
  };
};
