import { useWallet } from '@solana/wallet-adapter-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SortOrder } from 'antd/lib/table/interface';
import { ColumnType } from 'antd/es/table';
import { create } from 'zustand';

import { BondHistory, fetchBondsHistory } from '@frakt/api/bonds';

import { formatSortOrderToNormalValue } from '../../../helpers';

const LIMIT = 10;

export const useFetchBondsHistory = ({
  queryData,
  showOwnerBonds,
  eventType,
  marketPubkey,
}: {
  eventType: string;
  queryData: { sortBy: string; order: string };
  showOwnerBonds: boolean;
  marketPubkey: string;
}) => {
  const { publicKey } = useWallet();

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchBondsHistory({
      skip: LIMIT * pageParam,
      limit: LIMIT,
      sortBy: queryData?.sortBy || 'when',
      order: queryData?.order || 'desc',
      walletPubkey: showOwnerBonds && publicKey,
      eventType,
      marketPubkey,
    });

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [publicKey, queryData, showOwnerBonds, eventType, marketPubkey],
      queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageParam - 1 ?? undefined;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
      },
      staleTime: 60 * 1000,
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      enabled: !!queryData?.order,
    });

  const bondsData = data?.pages?.map((page) => page.data).flat() || [];

  return {
    data: bondsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  };
};

interface HistoryBondsSortState {
  setSortQuery: ({
    column,
    order,
  }: {
    column: ColumnType<BondHistory>;
    order: SortOrder;
  }) => void;
  queryData: {
    order: string;
    sortBy: string;
  };
}

export const useHistoryBondsSort = create<HistoryBondsSortState>((set) => ({
  queryData: null,
  setSortQuery: ({ order, column }) =>
    set((state) => ({
      ...state,
      queryData: {
        order: formatSortOrderToNormalValue(order),
        sortBy: column.dataIndex?.toString(),
      },
    })),
}));
