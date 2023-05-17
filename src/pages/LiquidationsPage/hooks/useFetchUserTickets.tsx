import { LotteryTickets, fetchUserTickets } from '@frakt/api/raffle';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

type UseFetchUserTickets = () => {
  lotteryTickets: LotteryTickets;
  userTicketsIsLoading: boolean;
};

export const useFetchUserTickets: UseFetchUserTickets = () => {
  const { publicKey } = useWallet();

  const {
    data: lotteryTickets,
    isLoading,
    isFetching,
  }: {
    data: LotteryTickets;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchUserTickets'],
    () => fetchUserTickets(publicKey?.toBase58()),
    {
      enabled: !!publicKey,
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    },
  );

  const userTicketsIsLoading = isLoading || isFetching;

  return { lotteryTickets, userTicketsIsLoading };
};
