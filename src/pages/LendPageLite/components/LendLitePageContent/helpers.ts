import { MarketPreview } from '@frakt/api/bonds';

export const getMarketsToDisplay = (
  marketPubkey: string,
  marketsPreview: MarketPreview[],
  filteredMarkets: MarketPreview[],
) => {
  const updatedMarkets = updateSelectedMarket(marketsPreview, marketPubkey);
  const selectedMarkets = updateSelectedMarket(filteredMarkets, marketPubkey);

  const markets = filteredMarkets.length ? selectedMarkets : updatedMarkets;

  return markets;
};

const updateSelectedMarket = (
  markets: MarketPreview[],
  marketPubkey: string,
) => {
  return markets.map((market) => {
    return market?.marketPubkey === marketPubkey
      ? { ...market, selected: true }
      : { ...market };
  });
};

export const getFilteredMarkets = (
  marketsPreview: MarketPreview[],
  selectedMarkets: string[],
) => {
  return marketsPreview.filter(({ collectionName }) =>
    selectedMarkets.includes(collectionName),
  );
};
