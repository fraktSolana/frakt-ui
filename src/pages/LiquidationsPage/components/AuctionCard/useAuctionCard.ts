import { calculateAuctionPrice } from '@frakters/raffle-sdk/lib/raffle-core/helpers';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';

import {
  LiquidateBondOnAuction,
  buyAuction,
  buyAuctionBond,
} from '@frakt/utils/raffles';
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

  const currentTime = moment().unix();

  const rawTimeToNextRound =
    auction?.denominator -
    ((currentTime - auction.startedAt) % auction?.denominator);

  const rawBuyPrice = calculateAuctionPrice({
    now: currentTime,
    startPrice: auction.startPrice,
    startTime: auction.startedAt,
    delta: auction.delta,
    deltaType: auction.deltaType,
    denominator: auction?.denominator,
  });

  const rawNextPrice = calculateAuctionPrice({
    now: currentTime + rawTimeToNextRound + 1,
    startPrice: auction.startPrice,
    startTime: auction.startedAt,
    delta: auction.delta,
    deltaType: auction.deltaType,
    denominator: auction?.denominator,
  });

  const onSubmit = async (): Promise<void> => {
    const wallet = useWallet();
    const { connection } = useConnection();

    openLoadingModal();
    try {
      // const result = await LiquidateBondOnAuction({
      //   connection,
      //   wallet,
      //   // repayAccounts,
      //   // fbond,
      // });
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const timeToNextRound = currentTime + rawTimeToNextRound;
  const nextPrice = parseFloat((rawNextPrice / 1e9).toFixed(3));
  const buyPrice = parseFloat((rawBuyPrice / 1e9).toFixed(3));

  return {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    timeToNextRound,
    buyPrice,
    nextPrice,
  };
};

export const useBondAuction = () => {
  const onSubmit = async () => {
    try {
      if (!auction?.bondPubKey) {
        const result = await buyAuction({
          connection,
          wallet,
          nftMint: auction?.nftMint,
          raffleAddress: auction.auctionPubkey,
        });
      } else {
        const result = await buyAuctionBond({
          connection,
          wallet,
          nftMint: auction?.nftMint,
          raffleAddress: auction.auctionPubkey,
          fbond: auction.bondPubKey,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return {};
};
