import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import { liquidateBondOnAuction } from '@frakt/utils/raffles';
import { AuctionItem } from '@frakt/api/auctions';

export const useBondAuctionCard = (
  auction: AuctionItem,
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
      const { nftMint, bondParams, banxStake, adventureStakes, cnftParams } =
        auction;

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
        banxStakePubkey: banxStake ? banxStake.publicKey : undefined,
        adventureSubscriptionsPubkeys: adventureStakes
          ? adventureStakes.map((adventureSubscription) => ({
              adventure: new web3.PublicKey(adventureSubscription.adventure),
              adventureSubscription: new web3.PublicKey(
                adventureSubscription.publicKey,
              ),
            }))
          : undefined,
        cnftParams,
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
