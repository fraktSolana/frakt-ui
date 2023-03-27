import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { useParams } from 'react-router-dom';
import create from 'zustand';

import { useFetchAllUserBonds, useWalletBonds } from '@frakt/utils/bonds';
import {
  MarketPreview,
  fetchMarketsPreview,
  fetchAllBonds,
} from '@frakt/api/bonds';

import { formatSortOrderToNormalValue } from '../helpers';

export enum MarketTabsNames {
  HISTORY = 'history',
  BONDS = 'bonds',
}

type UseMarketsPreview = () => {
  marketsPreview: MarketPreview[];
  isLoading: boolean;
};

export const useMarketsPreview: UseMarketsPreview = () => {
  const { data, isLoading } = useQuery(
    ['marketsPreview'],
    () => fetchMarketsPreview(),
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

export const useMarketsPage = () => {
  const wallet = useWallet();

  const { marketPubkey, walletPubkey } = useParams<{
    marketPubkey: string;
    walletPubkey?: string;
  }>();

  const { bonds, isLoading: bondsLoanding } = useWalletBonds({
    walletPubkey: wallet.publicKey,
    marketPubkey: marketPubkey && new web3.PublicKey(marketPubkey),
  });

  const {
    bonds: userBonds,
    // isLoading: userBondsLoanding,
    hideBond: hideUserBond,
  } = useFetchAllUserBonds({ walletPubkey });

  return {
    bonds: walletPubkey && userBonds?.length ? userBonds : bonds,
    hideUserBond,
    loading: false,
  };
};

const LIMIT = 20;

export const useFetchAllBonds = ({ queryData }: { queryData: any }) => {
  const { publicKey } = useWallet();

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchAllBonds({
      skip: LIMIT * pageParam,
      limit: LIMIT,
      sortBy: queryData.sortBy,
      order: queryData.order,
    });

    if (!data?.length) {
      setIsListEnded(true);
    }

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [publicKey, queryData],
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
  };
};

interface BondsSortState {
  setSortQuery: (value: any) => void;
  queryData: {
    order: string;
    sortBy: string;
  };
}

export const useBondsSort = create<BondsSortState>((set) => ({
  queryData: null,
  setSortQuery: ({ order = 'asc', column }) =>
    set((state) => ({
      ...state,
      queryData: {
        order: formatSortOrderToNormalValue(order),
        sortBy: 'size',
        // sortBy: column.dataIndex || 'nftName',
      },
    })),
}));
