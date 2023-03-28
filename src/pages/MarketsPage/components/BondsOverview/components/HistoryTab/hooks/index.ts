import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';

import { fetchBondsHistory } from '@frakt/api/bonds';
import create from 'zustand';
import { formatSortOrderToNormalValue } from '../../../helpers';

const LIMIT = 20;

export const useFetchBondsHistory = ({
  queryData,
  showOwnerBonds,
}: {
  queryData: any;
  showOwnerBonds: boolean;
}) => {
  const { publicKey } = useWallet();

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchBondsHistory({
      skip: LIMIT * pageParam,
      limit: LIMIT,
      sortBy: queryData.sortBy,
      order: queryData.order,
      walletPubkey: showOwnerBonds && publicKey,
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
      queryKey: [publicKey, queryData, showOwnerBonds],
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
    data: bondsData,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    loading: isLoading,
  };
};

interface HistoryBondsSortState {
  setSortQuery: (value: any) => void;
  queryData: {
    order: string;
    sortBy: string;
  };
}

export const useHistoryBondsSort = create<HistoryBondsSortState>((set) => ({
  queryData: null,
  setSortQuery: ({ order = 'desc', column }) =>
    set((state) => ({
      ...state,
      queryData: {
        order: formatSortOrderToNormalValue(order),
        sortBy: column.dataIndex || 'nftName',
      },
    })),
}));
