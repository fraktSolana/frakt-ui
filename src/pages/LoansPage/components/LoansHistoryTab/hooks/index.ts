import { useWallet } from '@solana/wallet-adapter-react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchLoansHistory } from '@frakt/api/loans';
import { Sort } from '@frakt/components/Table';

const LIMIT = 10;

export const useFetchLoansHistory = ({ queryData }: { queryData?: Sort }) => {
  const { publicKey } = useWallet();

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchLoansHistory({
      skip: LIMIT * pageParam,
      limit: LIMIT,
      sortBy: queryData?.field,
      direction: queryData?.direction,
      walletPubkey: publicKey,
    });

    return { pageParam, data };
  };

  const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
    useInfiniteQuery({
      queryKey: [publicKey, queryData],
      queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
      getPreviousPageParam: ({ pageParam }) => pageParam - 1 ?? undefined,
      getNextPageParam: ({ data, pageParam }) =>
        data?.length ? pageParam + 1 : undefined,
      staleTime: 60 * 1000,
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const loansHistory = data?.pages?.map(({ data }) => data).flat() || [];

  return {
    data: loansHistory,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};
