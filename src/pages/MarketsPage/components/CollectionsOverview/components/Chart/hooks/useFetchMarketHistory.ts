import { fetchMarketHistory, MarketHistory } from '@frakt/api/bonds';
import { useQuery } from '@tanstack/react-query';

export const useFetchMarketHistory = ({ marketPubkey }) => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: MarketHistory[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchMarketHistory', marketPubkey],
    () => fetchMarketHistory({ marketPubkey }),
    {
      enabled: !!marketPubkey,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

  return {
    data: data || [],
    loading: isLoading || isFetching,
  };
};
