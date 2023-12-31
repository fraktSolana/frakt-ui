import { NFT } from './../../../../types';
import { MarketPreview } from '@frakt/api/bonds';

export const parseMarketsPreview = (markets: MarketPreview[]): NFT[] => {
  return markets.map((market) => {
    return {
      name: market?.collectionName,
      image: market?.collectionImage,
      maxLoanValue: market?.bestOffer,
      duration: market?.bestDuration,
      activeBondsAmount: market?.activeBondsAmount,
      bestOffer: market?.bestOffer,
      fee: market?.fee,
    };
  });
};
