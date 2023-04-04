import { fetchLoansHistory } from '@frakt/api/loans';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

export const useFetchLoansHistory = () => {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery(
    ['fetchLoansHistory', publicKey],
    () => fetchLoansHistory({ walletPubkey: publicKey }),
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      enabled: !!publicKey,
    },
  );

  return { data, isLoading };
};
