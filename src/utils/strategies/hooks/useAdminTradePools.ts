import { fetchAdminTradePools } from '@frakt/api/strategies';
import { TradePool } from '@frakt/pages/StrategiesPage/types';
import { useQuery } from '@tanstack/react-query';

type UseAdminTradePools = (props: { walletPublicKey: string }) => {
  tradePoolsAdmin: TradePool[];
  isLoading: boolean;
};
const useAdminTradePools: UseAdminTradePools = ({ walletPublicKey }) => {
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

export default useAdminTradePools;
