import { NFT } from './../../../../types';
import { MarketPreview } from '@frakt/api/bonds';

export const parseMarketsPreview = (markets: MarketPreview[]): NFT[] => {
  return markets.map((market) => {
    return {
      image: market?.collectionImage,
      maxLoanValue: market?.bestOffer,
      duration: market?.duration[0],
      fee: 1,
    };
  });
};
