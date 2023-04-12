import { MarketPreview } from '@frakt/api/bonds';

export const formateMarketPreviewValues = (marketPreview: MarketPreview) => {
  if (!marketPreview?.marketPubkey) return;

  const { bestOffer, duration, apy, bestLTV, offerTVL } = marketPreview;
  const formattedBestOfferValue = (bestOffer / 1e9 || 0)?.toFixed(2);

  const formattedDurationValue = duration?.length
    ? `${duration.join(' / ')} days`
    : '--';

  const formattedAprValue = (apy || 0).toFixed(2);

  return {
    bestOffer: formattedBestOfferValue,
    duration: formattedDurationValue,
    apr: formattedAprValue,
    bestLTV,
    offerTVL,
  };
};
