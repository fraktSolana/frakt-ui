import { fetchBondsStats, TotalBondsStats } from '@frakt/api/bonds';
import { web3 } from '@frakters/raffle-sdk';
import { useQuery } from '@tanstack/react-query';

type UseFetchBondsStats = ({
  marketPubkey,
  walletPubkey,
}: {
  marketPubkey: string;
  walletPubkey: web3.PublicKey;
}) => {
  bondsStats: TotalBondsStats;
  isLoading: boolean;
};

export const useFetchBondsStats: UseFetchBondsStats = ({
  marketPubkey,
  walletPubkey,
}) => {
  const { data, isLoading } = useQuery(
    ['useFetchBondsStats', marketPubkey, walletPubkey],
    () => fetchBondsStats({ marketPubkey, walletPubkey }),
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  return {
    bondsStats: data,
    isLoading,
  };
};
