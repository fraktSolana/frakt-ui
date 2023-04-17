import { fetchUserRewards, UserRewards } from '@frakt/api/user';
import { useQuery } from '@tanstack/react-query';

export const useFetchUserRewards = ({ walletPublicKey }) => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: UserRewards;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchUserRewards', walletPublicKey],
    () => fetchUserRewards({ publicKey: walletPublicKey }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: data,
    loading: isLoading || isFetching,
  };
};
