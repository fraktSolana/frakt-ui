import { MarketPreview } from '@frakt/api/bonds';

export const parseMarketsPreview = (markets: MarketPreview[]) => {
  return markets.map((market) => {
    return {
      nftName: market.collectionName,
      pubkey: market.marketPubkey,
      imageUrl: market?.collectionImage,
      maxLoanValue: market?.bestOffer,
      duration: market?.duration[0],
      fee: 1,
    };
  });
};
