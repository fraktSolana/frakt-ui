import { TradePoolStats, fetchTradePoolStats } from '@frakt/api/strategies';
import { useQuery } from '@tanstack/react-query';

export const useTradePoolStats = ({ walletPublicKey }) => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: TradePoolStats;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['tradePoolStats', walletPublicKey],
    () => fetchTradePoolStats({ walletPublicKey }),
    {
      enabled: !!walletPublicKey,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    tradePoolStats: data,
    loading: isLoading || isFetching,
  };
};
