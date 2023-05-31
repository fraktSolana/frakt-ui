import { LiquidityPool, fetchLiquidityPools } from '@frakt/api/pools';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

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
