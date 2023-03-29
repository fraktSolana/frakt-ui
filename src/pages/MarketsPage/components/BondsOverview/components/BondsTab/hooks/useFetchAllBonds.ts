import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import create from 'zustand';
import produce from 'immer';

import { fetchAllBonds } from '@frakt/api/bonds';

const LIMIT = 20;

export const useFetchAllBonds = ({
  queryData,
  showOwnerBonds,
  marketPubkey,
}: {
  queryData: { sortBy: string; order: string };
  showOwnerBonds: boolean;
  marketPubkey: string;
}) => {
  const { publicKey } = useWallet();

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const { hiddenBondsPubkeys, hideBond } = useHiddenBondsPubkeys();

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchAllBonds({
      skip: LIMIT * pageParam,
      limit: LIMIT,
      sortBy: queryData?.sortBy,
      order: queryData?.order,
      walletPubkey: showOwnerBonds && publicKey,
      marketPubkey,
    });

    if (!data?.length) {
      setIsListEnded(true);
    }

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [publicKey, queryData, showOwnerBonds, marketPubkey],
      queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.data.length !== 0 ? nextPage : undefined;
      },
      staleTime: 60 * 1000,
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const bondsData = data?.pages?.map((page) => page.data).flat() || [];

  return {
    data:
      bondsData?.filter(
        ({ fbond }) => !hiddenBondsPubkeys.includes(fbond?.publicKey),
      ) || [],
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    hideBond,
    loading: isLoading,
  };
};

interface HiddenBondsPubkeysState {
  hiddenBondsPubkeys: string[];
  hideBond: (bondPubkey: string) => void;
}
const useHiddenBondsPubkeys = create<HiddenBondsPubkeysState>((set) => ({
  hiddenBondsPubkeys: [],
  hideBond: (bondPubkey) =>
    set(
      produce((state: HiddenBondsPubkeysState) => {
        state.hiddenBondsPubkeys = [...state.hiddenBondsPubkeys, bondPubkey];
      }),
    ),
}));
