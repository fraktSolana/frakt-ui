import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import { liquidateBondOnAuction } from '@frakt/utils/raffles';
import { AuctionListItem } from '@frakt/api/raffle';

export const useBondAuctionCard = (
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
      const { nftMint, bondParams } = auction;

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
      } = bondParams;

      const convertedRepayAccounts = repayAccounts.map(
        ({ bondOffer, bondTradeTransaction, user }) => {
          return {
            bondOffer: new web3.PublicKey(bondOffer),
            bondTradeTransaction: new web3.PublicKey(bondTradeTransaction),
            user: new web3.PublicKey(user),
          };
        },
      );

      console.log({
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
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return { onSubmit, loadingModalVisible };
};
