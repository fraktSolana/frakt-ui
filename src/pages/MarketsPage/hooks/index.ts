import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { fetchMarketsPreview, MarketPreview } from '@frakt/api/bonds';

type UseMarketsPreview = (props: { showOwnOrders: boolean }) => {
  marketsPreview: MarketPreview[];
  isLoading: boolean;
};

export const useMarketsPreview: UseMarketsPreview = (props) => {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery(
    ['marketsPreview', props?.showOwnOrders],
    () =>
      fetchMarketsPreview({
        walletPubkey: props?.showOwnOrders && publicKey,
      }),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    marketsPreview: data || [],
    isLoading,
  };
};
