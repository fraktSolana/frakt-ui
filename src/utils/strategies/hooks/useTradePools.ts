import { fetchTradePools, TradePoolUser } from '@frakt/api/strategies';
import { useQuery } from '@tanstack/react-query';

type UseTradePools = (props: { walletPublicKey: string }) => {
  tradePools: TradePoolUser[] | null;
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
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    tradePools: data || null,
    isLoading,
  };
};
