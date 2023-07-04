import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  defaultFilterOption,
  defaultSortOption,
  filterOptions,
  sortOptions,
} from '../../OngoingAuctionTab/constants';

const FETCH_LIMIT = 15;

const baseUrl = `https://${process.env.BACKEND_DOMAIN}`;

export const useFetchAuctionsHistory = () => {
  const { publicKey } = useWallet();

  const [sortOption, setSortOption] = useState<any>(defaultSortOption);
  const [filterOption, setFilterOption] = useState<any>(defaultFilterOption);

  //TODO: replace to another request
  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const queryUrl = `${baseUrl}/liquidation?history=true&limit=${FETCH_LIMIT}&skip=${
      FETCH_LIMIT * pageParam
    }`;

    const data = await (await fetch(queryUrl)).json();

    return { pageParam, data };
  };

  const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
    useInfiniteQuery({
      queryKey: [publicKey],
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
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const auctionsAndRafflesList =
    data?.pages?.map((page) => page.data).flat() || [];

  //TODO: remove isAuctin filter, request should return only auctions

  return {
    data: auctionsAndRafflesList.filter((auction) => auction?.isAuction),
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,

    sortProps: {
      options: sortOptions,
      sortOption,
      onSortChange: setSortOption,
    },
    filterProps: {
      options: filterOptions,
      filterOption,
      onFilterChange: setFilterOption,
    },
    searchProps: {
      options: [],
      placeholder: 'Select a collection',
      optionKeys: {
        labelKey: 'nftCollectionName',
        valueKey: 'nftCollectionName',
        imageKey: 'nftImageUrl',
      },
      selectedOptions: [],
      labels: ['Collections', 'Auctions'],
      onFilterChange: null,
    },
  };
};
