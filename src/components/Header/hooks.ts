import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

export interface LeaderBoard {
  deposited: number;
  interest: number;
  lent: number;
  loyaltyBoost: number;
  pfpImage: string | null;
  points: number;
  rank: number;
  teamName: string;
  wallet: string;
}

export const fetchUserIndividual = async (
  publicKey: string,
): Promise<LeaderBoard> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/leaderboard?sort=asc&skip=0&limit=10&search=${publicKey}&sortBy=rank`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data?.[0];
};

export const useFetchUserIndividual = (): {
  data: LeaderBoard;
  isLoading: boolean;
} => {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery(
    ['userIndividual', publicKey],
    () => fetchUserIndividual(publicKey.toBase58()),
    {
      networkMode: 'offlineFirst',
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data,
    isLoading: isLoading,
  };
};
