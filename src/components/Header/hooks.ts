import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { LeaderBoard, fetchUserIndividual } from '@frakt/api/user';

export const useFetchUserIndividual = (): {
  data: LeaderBoard;
  isLoading: boolean;
} => {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery(
    ['userIndividual', publicKey?.toBase58()],
    () => fetchUserIndividual(publicKey?.toBase58()),
    {
      networkMode: 'offlineFirst',
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: !!publicKey,
    },
  );

  return {
    data,
    isLoading: isLoading,
  };
};
