import { fetchAdminTradePools, TradePool } from '@frakt/api/strategies';
import { useQuery } from '@tanstack/react-query';

type UseAdminTradePools = (props: { walletPublicKey: string }) => {
  tradePoolsAdmin: TradePool[] | null;
  isLoading: boolean;
};
export const useAdminTradePools: UseAdminTradePools = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['tradePoolsAdmin', walletPublicKey],
    () =>
      fetchAdminTradePools({
        walletPublicKey: walletPublicKey,
      }),
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    tradePoolsAdmin: data || null,
    isLoading,
  };
};
