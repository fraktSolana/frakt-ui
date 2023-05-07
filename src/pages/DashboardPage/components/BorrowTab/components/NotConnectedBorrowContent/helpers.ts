import { MarketPreview } from '@frakt/api/bonds';

export const parseMarketsPreview = (markets: MarketPreview[]) => {
  return markets.map((market) => {
    return {
      nftName: market.collectionName,
      pubkey: market.marketPubkey,
      nftImage: market?.collectionImage,
      maxLoanValue: (market?.bestOffer / 1e9)?.toFixed(0),
      duration: market?.duration[0],
      fee: 1,
    };
  });
};
