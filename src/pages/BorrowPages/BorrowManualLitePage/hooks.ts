import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';

import { fetchWalletBorrowNfts } from '@frakt/api/nft';

const FETCH_LIMIT = 15;

type SortName = 'maxLoanValue' | 'name';
type SortOrder = 'desc' | 'asc';

export const useWalletNfts = ({
  duration = '7',
}: {
  duration?: '7' | '14' | '0';
}) => {
  const wallet = useWallet();

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [sortName, setSortName] = useState<SortName>('maxLoanValue');

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchWalletBorrowNfts({
      publicKey: wallet.publicKey,
      limit: FETCH_LIMIT,
      offset: pageParam * FETCH_LIMIT,
      search,
      sortBy: sortName,
      sortOrder: sortOrder,
      duration,
    });

    return { pageParam, data };
  };

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'walletNfts',
        wallet?.publicKey?.toBase58(),
        search,
        sortOrder,
        sortName,
        duration,
      ],
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

  return {
    nfts: data?.pages?.map((page) => page.data).flat() || [],
    initialLoading: isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    sortName,
    setSortName,
  };
};
