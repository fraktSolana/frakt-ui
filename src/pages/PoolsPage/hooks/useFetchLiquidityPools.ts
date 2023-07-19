import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { LiquidityPool, fetchLiquidityPools } from '@frakt/api/pools';

export const useFetchLiquidityPools = ({ walletPublicKey }) => {
  const { search } = useLocation();
  const privatePoolHash = useMemo(
    () => new URLSearchParams(search).get('pph'),
    [search],
  );

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: LiquidityPool[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchLiquidityPools', walletPublicKey, privatePoolHash],
    () => fetchLiquidityPools({ walletPublicKey, privatePoolHash }),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: data || [],
    loading: isLoading || isFetching,
  };
};
