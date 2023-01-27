import {
  Bond,
  fetchAllMarkets,
  fetchCertainMarket,
  fetchMarketPairs,
  fetchWalletBonds,
  Market,
  Pair,
} from '@frakt/api/bonds';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';

type UseMarket = (props: { marketPubkey: string }) => {
  market: Market;
  isLoading: boolean;
};
export const useMarket: UseMarket = ({ marketPubkey }) => {
  const { data, isLoading } = useQuery(
    ['market', marketPubkey],
    () =>
      fetchCertainMarket({
        marketPubkey: new web3.PublicKey(marketPubkey),
      }),
    {
      enabled: !!marketPubkey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    market: data || null,
    isLoading,
  };
};

export const useMarkets = () => {
  const { data, isLoading } = useQuery(['markets'], () => fetchAllMarkets(), {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    markets: data || null,
    isLoading,
  };
};

type UseMarketPairs = (props: { marketPubkey: string }) => {
  pairs: Pair[];
  isLoading: boolean;
};
export const useMarketPairs: UseMarketPairs = ({ marketPubkey }) => {
  const { data, isLoading } = useQuery(
    ['marketPairs', marketPubkey],
    () => fetchMarketPairs({ marketPubkey: new web3.PublicKey(marketPubkey) }),
    {
      enabled: !!marketPubkey,
      staleTime: 30 * 1000, //? 30sec
      refetchOnWindowFocus: false,
    },
  );

  return {
    pairs: data || [],
    isLoading,
  };
};

type UseWalletBonds = (props: { walletPubkey: web3.PublicKey }) => {
  bonds: Bond[];
  isLoading: boolean;
};
export const useWalletBonds: UseWalletBonds = ({ walletPubkey }) => {
  const { data, isLoading } = useQuery(
    ['walletBonds', walletPubkey],
    () => fetchWalletBonds({ walletPubkey }),
    {
      enabled: !!walletPubkey,
      staleTime: 60 * 1000, //? 1 min
      refetchOnWindowFocus: false,
    },
  );

  return {
    bonds: data || [],
    isLoading,
  };
};
