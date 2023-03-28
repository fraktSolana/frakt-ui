import { fetchBondsStats, TotalBondsStats } from '@frakt/api/bonds';
import { useQuery } from '@tanstack/react-query';

type UseFetchBondsStats = () => {
  bondsStats: TotalBondsStats;
  isLoading: boolean;
};

export const useFetchBondsStats: UseFetchBondsStats = () => {
  const { data, isLoading } = useQuery(
    ['useFetchBondsStats'],
    () => fetchBondsStats(),
    {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    bondsStats: data,
    isLoading,
  };
};
