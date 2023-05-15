import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { create } from 'zustand';
import produce from 'immer';

import { fetchWalletBorrowNfts } from '@frakt/api/nft';

const FETCH_LIMIT = 15;

export const useDashboardWalletNfts = () => {
  const wallet = useWallet();

  const [search, setSearch] = useState('');
  const { hiddenNFTsMint, hideNFT } = useHiddenNFTsMint();

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchWalletBorrowNfts({
      publicKey: wallet.publicKey,
      limit: FETCH_LIMIT,
      offset: pageParam * FETCH_LIMIT,
      search,
    });

    return { pageParam, data };
  };

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ['dashboardWalletNfts', wallet?.publicKey?.toBase58(), search],
    queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
    getPreviousPageParam: (firstPage) => {
      return firstPage.pageParam - 1 ?? undefined;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: wallet.connected,
  });

  const nftsData = data?.pages?.map((page) => page.data).flat() || [];

  return {
    nfts: nftsData?.filter(({ mint }) => !hiddenNFTsMint.includes(mint)) || [],
    initialLoading: isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    search,
    setSearch,
    isSuccess,
    hideNFT,
  };
};

interface HiddenNFTsPubkeysState {
  hiddenNFTsMint: string[];
  hideNFT: (nft: string) => void;
}
const useHiddenNFTsMint = create<HiddenNFTsPubkeysState>((set) => ({
  hiddenNFTsMint: [],
  hideNFT: (nftMint: string) =>
    set(
      produce((state: HiddenNFTsPubkeysState) => {
        state.hiddenNFTsMint = [...state.hiddenNFTsMint, nftMint];
      }),
    ),
}));
