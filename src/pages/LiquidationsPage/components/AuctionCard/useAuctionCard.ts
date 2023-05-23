import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { liquidateBondOnAuction, buyAuction } from '@frakt/utils/raffles';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { AuctionListItem } from '@frakt/api/raffle';

export const useAuctionCard = (
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
      if (!auction?.bondParams?.fbondPubkey) {
        const result = await buyAuction({
          connection,
          wallet,
          nftMint: auction?.nftMint,
          raffleAddress: auction.classicParams?.auctionPubkey,
        });

        if (result) {
          hideAuction(auction.nftMint);
        }
      } else {
        const {
          fbondPubkey,
          collateralBoxType,
          collateralBox,
          collateralTokenMint,
          collateralTokenAccount,
          collateralOwner,
          fraktMarket,
          oracleFloor,
          whitelistEntry,
          repayAccounts,
        } = auction.bondParams;
        const result = await liquidateBondOnAuction({
          connection,
          wallet,
          fbondPubkey: fbondPubkey,
          collateralBoxType: collateralBoxType,
          collateralBoxPubkey: collateralBox,
          collateralTokenMint: collateralTokenMint,
          collateralTokenAccount: collateralTokenAccount,
          collateralOwner: collateralOwner,
          fraktMarketPubkey: fraktMarket,
          oracleFloorPubkey: oracleFloor,
          whitelistEntryPubkey: whitelistEntry,
          repayAccounts: repayAccounts.map(
            ({ bondOffer, bondTradeTransaction }) => {
              return {
                bondOffer: new web3.PublicKey(bondOffer),
                bondTradeTransaction: new web3.PublicKey(bondTradeTransaction),
                user: wallet.publicKey,
              };
            },
          ),
        });

        if (result) {
          hideAuction(auction.nftMint);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
  };
};
