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
      const { nftMint } = auction;
      const isBondAuctions = auction?.bondParams?.fbondPubkey;

      if (!isBondAuctions) {
        const raffleAddress = auction.classicParams?.auctionPubkey;
        const result = await buyAuction({
          connection,
          wallet,
          nftMint,
          raffleAddress,
        });

        if (result) {
          hideAuction(nftMint);
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

        const convertedRepayAccounts = repayAccounts.map(
          ({ bondOffer, bondTradeTransaction, user }) => {
            return {
              bondOffer: new web3.PublicKey(bondOffer),
              bondTradeTransaction: new web3.PublicKey(bondTradeTransaction),
              user: new web3.PublicKey(user),
            };
          },
        );

        const result = await liquidateBondOnAuction({
          connection,
          wallet,
          fbondPubkey,
          collateralBoxType,
          collateralBox,
          collateralTokenMint,
          collateralTokenAccount,
          collateralOwner,
          fraktMarket,
          oracleFloor,
          whitelistEntry,
          repayAccounts: convertedRepayAccounts,
        });

        if (result) {
          hideAuction(nftMint);
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
