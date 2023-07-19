import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchLoansHistory } from '@frakt/api/loans';
import { Option } from '@frakt/components/SortDropdown';

const LIMIT = 10;

const defaultSortOption = { label: 'When', value: 'date_desc' };

export const useFetchLoansHistory = () => {
  const { publicKey, connected } = useWallet();

  const [querySearch, setQuerySearch] = useState<string>('');
  const [sortOption, setSortOption] = useState<Option>(defaultSortOption);

  const [name, order] = sortOption?.value?.split('_') || [];

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchLoansHistory({
      skip: LIMIT * pageParam,
      limit: LIMIT,
      sortBy: name,
      direction: order,
      walletPubkey: publicKey,
      querySearch,
    });

    return { pageParam, data };
  };

  const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
    useInfiniteQuery({
      queryKey: [publicKey, sortOption, querySearch],
      queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
      getPreviousPageParam: ({ pageParam }) => pageParam - 1 ?? undefined,
      getNextPageParam: ({ data, pageParam }) =>
        data?.length ? pageParam + 1 : undefined,
      staleTime: 60 * 1000,
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
      enabled: connected,
      refetchOnWindowFocus: false,
    });

  const loansHistory = data?.pages?.map(({ data }) => data).flat() || [];

  return {
    data: loansHistory,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    setQuerySearch,
    sortParam: {
      onChange: setSortOption,
      option: sortOption,
    },
  };
};
