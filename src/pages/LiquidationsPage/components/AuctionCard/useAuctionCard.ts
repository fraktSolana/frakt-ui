import {
  WalletContextState,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
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
      const isBondAuction = auction?.bondParams?.fbondPubkey;

      if (!isBondAuction) {
        const raffleAddress = auction.classicParams?.auctionPubkey;
        await handleAuction(
          connection,
          wallet,
          nftMint,
          raffleAddress,
          buyAuction,
        );
      } else {
        const { fbondPubkey, repayAccounts, ...auctionParams } =
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

        await handleAuction(
          connection,
          wallet,
          nftMint,
          null,
          liquidateBondOnAuction,
          {
            fbondPubkey,
            repayAccounts: convertedRepayAccounts,
            ...auctionParams,
          },
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const handleAuction = async (
    connection: web3.Connection,
    wallet: WalletContextState,
    nftMint: string,
    raffleAddress: string | null,
    auctionFunction: (...args: any) => Promise<boolean>,
    ...args: any
  ) => {
    const result = await auctionFunction({
      connection,
      wallet,
      nftMint,
      raffleAddress,
      ...args[0],
    });

    if (result) {
      hideAuction(nftMint);
    }
  };

  return { onSubmit, closeLoadingModal, loadingModalVisible };
};
