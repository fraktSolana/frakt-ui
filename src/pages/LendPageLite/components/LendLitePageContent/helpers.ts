import { MarketPreview } from '@frakt/api/bonds';

export const getMarketsToDisplay = (
  marketsPreview: MarketPreview[],
  filteredMarkets: MarketPreview[],
) => {
  const markets = filteredMarkets.length ? filteredMarkets : marketsPreview;
  return markets;
};

export const getFilteredMarkets = (
  marketsPreview: MarketPreview[],
  selectedMarkets: string[],
) => {
  return marketsPreview.filter(({ collectionName }) =>
    selectedMarkets.includes(collectionName),
  );
};
