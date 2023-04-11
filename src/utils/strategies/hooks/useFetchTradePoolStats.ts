import { TradePoolStats, fetchTradePoolStats } from '@frakt/api/strategies';
import { useQuery } from '@tanstack/react-query';

export const useFetchTradePoolStats = ({ walletPublicKey }) => {
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
      refetchOnWindowFocus: false,
    },
  );

  return {
    tradePoolStats: data,
    loading: isLoading || isFetching,
  };
};
