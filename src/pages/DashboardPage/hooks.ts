import { web3 } from '@frakt-protocol/frakt-sdk';
import { useQuery } from '@tanstack/react-query';

import { fetchAllUserStats, UserStats } from '@frakt/api/user';

export const useFetchAllStats = ({
  walletPublicKey,
  enabled,
}: {
  walletPublicKey: web3.PublicKey;
  enabled?: boolean;
}) => {
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
