import { calculateAuctionPrice } from '@frakters/raffle-sdk/lib/raffle-core/helpers';
import moment from 'moment';

import { AuctionItem } from '@frakt/api/auctions';

const calcPriceAndTimeForClassicAuctions = (auction: AuctionItem) => {
  const { denominator, startedAt, startPrice, delta, deltaType } =
    auction?.classicParams || {};

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

const parseAuctionsInfo = (auction: AuctionItem) => {
  const { classicParams } = auction;

  const { nextPrice, timeToNextRound, buyPrice } =
    calcPriceAndTimeForClassicAuctions(auction) || {};

  const floorPrice = classicParams?.floorPrice?.toFixed(3);

  return {
    timeToNextRound,
    floorPrice,
    nextPrice,
    buyPrice,
  };
};

export { parseAuctionsInfo };
