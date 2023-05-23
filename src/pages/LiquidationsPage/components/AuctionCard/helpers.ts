import { calculateAuctionPrice } from '@frakters/raffle-sdk/lib/raffle-core/helpers';
import moment from 'moment';

import { AuctionListItem } from '@frakt/api/raffle';

const calcPriceAndTimeForClassicAuctions = (auction: AuctionListItem) => {
  if (!auction?.classicParams?.auctionPubkey) return;
  const { denominator, startedAt, startPrice, delta, deltaType } =
    auction?.classicParams;
  const currentTime = moment().unix();

  const rawTimeToNextRound =
    denominator - ((currentTime - startedAt) % denominator);

  const rawBuyPrice = calculateAuctionPrice({
    now: currentTime,
    startPrice,
    startTime: startedAt,
    delta,
    deltaType,
    denominator,
  });

  const rawNextPrice = calculateAuctionPrice({
    now: currentTime + rawTimeToNextRound + 1,
    startPrice,
    startTime: startedAt,
    delta,
    deltaType,
    denominator,
  });

  return {
    timeToNextRound: currentTime + rawTimeToNextRound || 0,
    nextPrice: parseFloat((rawNextPrice / 1e9).toFixed(3)) || 0,
    buyPrice: parseFloat((rawBuyPrice / 1e9).toFixed(3)) || 0,
  };
};

export { calcPriceAndTimeForClassicAuctions };
