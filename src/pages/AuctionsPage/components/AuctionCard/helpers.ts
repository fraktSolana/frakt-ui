import { calculateAuctionPrice } from '@frakters/raffle-sdk/lib/raffle-core/helpers';
import moment from 'moment';

import { RefinanceAuctionListItem } from '@frakt/api/raffle';

const parseRefinanceAuctionsInfo = (auction: RefinanceAuctionListItem) => {
  const { nftName, nftImageUrl, nftCollectionName } = auction;

  const floorPrice = (auction?.bondParams.floorPrice / 1e9)?.toFixed(3);

  return {
    nftName,
    nftImageUrl,
    nftCollectionName,

    nextInterest: 0,
    timeToNextRound: 0,
    currentInterest: 0,

    floorPrice,
  };
};

export { parseRefinanceAuctionsInfo };
