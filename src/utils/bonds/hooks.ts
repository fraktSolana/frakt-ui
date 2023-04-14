import {
  fetchAllMarkets,
  fetchCertainMarket,
  fetchMarketPair,
  fetchMarketPairs,
  Market,
  Pair,
} from '@frakt/api/bonds';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';
import produce from 'immer';
import create from 'zustand';

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

interface HiddenPairsPubkeysState {
  hiddenPairsPubkeys: string[];
  hidePair: (pairPubkey: string) => void;
}
const useHiddenPairsPubkeys = create<HiddenPairsPubkeysState>((set) => ({
  hiddenPairsPubkeys: [],
  hidePair: (pairPubkey) =>
    set(
      produce((state: HiddenPairsPubkeysState) => {
        state.hiddenPairsPubkeys = [...state.hiddenPairsPubkeys, pairPubkey];
      }),
    ),
}));

export const useMarketPairs = ({ marketPubkey }) => {
  const { hiddenPairsPubkeys, hidePair } = useHiddenPairsPubkeys();

  const { data, isLoading, refetch } = useQuery(
    ['marketPairs', marketPubkey],
    () => fetchMarketPairs({ marketPubkey: new web3.PublicKey(marketPubkey) }),
    {
      enabled: !!marketPubkey,
      staleTime: 30 * 1000, //? 30sec
      refetchOnWindowFocus: false,
    },
  );

  return {
    pairs:
      data?.filter(
        ({ publicKey }) => !hiddenPairsPubkeys.includes(publicKey),
      ) || [],
    isLoading,
    hidePair,
    refetch,
  };
};

type UseMarketPair = (props: { pairPubkey: string }) => {
  pair: Pair | null;
  isLoading: boolean;
};
export const useMarketPair: UseMarketPair = ({ pairPubkey }) => {
  const { data, isLoading } = useQuery(
    ['pair', pairPubkey],
    () => fetchMarketPair({ pairPubkey: new web3.PublicKey(pairPubkey) }),
    {
      enabled: !!pairPubkey,
      staleTime: 5 * 1000, //? 30sec
      refetchOnWindowFocus: false,
    },
  );

  return {
    pair: data || null,
    isLoading,
  };
};
