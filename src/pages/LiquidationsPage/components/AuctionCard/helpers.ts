import { calculateAuctionPrice } from '@frakters/raffle-sdk/lib/raffle-core/helpers';
import moment from 'moment';

import { AuctionListItem } from '@frakt/api/raffle';

const calcPriceAndTimeForClassicAuctions = (auction: AuctionListItem) => {
  if (!auction?.classicParams?.auctionPubkey) return null;

  const { denominator, startedAt, startPrice, delta, deltaType } =
    auction?.classicParams;

  const currentTime = moment().unix();

  const rawTimeToNextRound =
    denominator - ((currentTime - startedAt) % denominator);

  const calculateAuctionPriceForTime = (time: number) => {
    const price = calculateAuctionPrice({
      now: time,
      startPrice,
      startTime: startedAt,
      delta,
      deltaType,
      denominator,
    });

    const parsedPrice = (price / 1e9)?.toFixed(3);
    return parseFloat(parsedPrice) || 0;
  };

  const timeToNextRound = currentTime + rawTimeToNextRound;
  const nextPrice = calculateAuctionPriceForTime(
    currentTime + rawTimeToNextRound + 1,
  );
  const buyPrice = calculateAuctionPriceForTime(currentTime);

  return {
    timeToNextRound: timeToNextRound || 0,
    nextPrice,
    buyPrice,
  };
};

const parseAuctionsInfo = (auction: AuctionListItem) => {
  const { nftName, nftImageUrl, nftCollectionName } = auction;

  const isBondAuction = auction?.bondParams?.fbondPubkey;

  const classicAuctionsInfo = calcPriceAndTimeForClassicAuctions(auction);

  const floorPrice = isBondAuction
    ? (auction?.bondParams?.floorPrice / 1e9)?.toFixed(3)
    : auction?.classicParams?.floorPrice?.toFixed(3);

  return {
    nftName,
    nftImageUrl,
    nftCollectionName,

    nextPrice: classicAuctionsInfo?.nextPrice,
    timeToNextRound: classicAuctionsInfo?.timeToNextRound,
    buyPrice: classicAuctionsInfo?.buyPrice,

    floorPrice,
    isBondAuction,
  };
};

const checkPriceThreshold = (
  fullPrice: number,
  currentPrice: number,
): boolean => {
  const threshold = fullPrice * 0.25;
  return currentPrice < threshold;
};

export { parseAuctionsInfo, checkPriceThreshold };
