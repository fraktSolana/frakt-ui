import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';

import { fetchMarketsPreview, MarketPreview } from '@frakt/api/bonds';

type UseMarketsPreview = (
  walletPubkey?: web3.PublicKey,
  showOnlyUser?: boolean,
) => {
  marketsPreview: MarketPreview[];
  isLoading: boolean;
};

export const useMarketsPreview: UseMarketsPreview = (
  walletPubkey,
  showOnlyUser = false,
) => {
  const { data, isLoading } = useQuery(
    ['marketsPreview', walletPubkey, showOnlyUser],
    () => fetchMarketsPreview({ walletPubkey, showOnlyUser }),
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
