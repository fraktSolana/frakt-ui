import { useQuery } from '@tanstack/react-query';

import { MarketPreview, fetchMarketsPreview } from '@frakt/api/bonds';
import { Tab } from '@frakt/components/Tabs';

type UseMarketsPreview = () => {
  marketsPreview: MarketPreview[];
  isLoading: boolean;
};

export const useMarketsPreview: UseMarketsPreview = () => {
  const { data, isLoading } = useQuery(
    ['marketsPreview'],
    () => fetchMarketsPreview(),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    marketsPreview: data || [],
    isLoading,
  };
};

export enum MarketTabsNames {
  HISTORY = 'history',
  BONDS = 'bonds',
}

export const MARKET_TABS: Tab[] = [
  {
    label: 'Bonds',
    value: 'bonds',
  },
  {
    label: 'History',
    value: 'history',
  },
];
