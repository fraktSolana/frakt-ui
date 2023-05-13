import { fetchAllUserStats, UserStats } from '@frakt/api/user';
import { useQuery } from '@tanstack/react-query';

export const useFetchAllStats = ({ walletPublicKey, enabled }) => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: UserStats;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchAllStats', walletPublicKey],
    () => fetchAllUserStats({ publicKey: walletPublicKey }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      enabled,
    },
  );

  return {
    data: data,
    loading: isLoading || isFetching,
  };
};
