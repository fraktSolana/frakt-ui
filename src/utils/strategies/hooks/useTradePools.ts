import { fetchTradePools } from '@frakt/api/strategies';
import { TradePool } from '@frakt/pages/StrategiesPage/types';
import { useQuery } from '@tanstack/react-query';

type UseTradePools = (props: { walletPublicKey: string }) => {
  tradePools: TradePool[];
  isLoading: boolean;
};
export const useTradePools: UseTradePools = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['tradePools', walletPublicKey],
    () =>
      fetchTradePools({
        walletPublicKey: walletPublicKey,
      }),
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    tradePools: data || null,
    isLoading,
  };
};

export default useTradePools;
