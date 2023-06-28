import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchUserTickets } from '@frakt/api/raffle';

import { fetchAdventuresInfo } from '@frakt/api/adventures';

export const useAdventuresInfoQuery = () => {
  const { publicKey } = useWallet();

  const {
    data: adventuresInfo,
    isLoading,
    refetch,
  } = useQuery(
    ['adventuresInfo', publicKey?.toBase58()],
    () => fetchAdventuresInfo({ publicKey }),
    {
      staleTime: 60_000,
      refetchInterval: 5_000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    adventuresInfo,
    isLoading,
    refetch,
  };
};

export const useRaffleTicketsQuery = () => {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery(
    ['fetchUserTickets', publicKey],
    () => fetchUserTickets(publicKey?.toBase58()),
    {
      enabled: !!publicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return { lotteryTickets: data?.currentTickets || 0, isLoading };
};
