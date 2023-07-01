import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { refinanceBondByLender } from '@frakt/utils/raffles/refinanceBondByLender';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { RefinanceAuctionItem } from '@frakt/api/auctions';

export const useRefinanceAuctionCard = (
  auction: RefinanceAuctionItem,
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
      const { nftMint } = auction;
      const { fbondPubkey, oracleFloor, hadoMarket, repayAccounts } =
        auction.bondParams;

      const convertedRepayAccounts = repayAccounts.map(
        ({ bondOffer, bondTradeTransaction, user }) => {
          return {
            bondOffer: new web3.PublicKey(bondOffer),
            bondTradeTransaction: new web3.PublicKey(bondTradeTransaction),
            user: new web3.PublicKey(user),
          };
        },
      );

      const result = await refinanceBondByLender({
        connection,
        wallet,
        fbondPubkey,
        oracleFloor,
        hadoMarketPubkey: hadoMarket,
        repayAccounts: convertedRepayAccounts,
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
