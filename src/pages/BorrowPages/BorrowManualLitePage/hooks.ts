import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  LoanDuration,
  MaxBorrow,
  fetchMaxBorrowValuePro,
  fetchWalletBorrowNfts,
} from '@frakt/api/nft';
import { web3 } from 'fbonds-core';
import { LoanType } from '@frakt/api/loans';
import { Sort } from '@frakt/components/Table';

const FETCH_LIMIT = 15;

export const useWalletNfts = ({
  duration = '7',
  queryData,
}: {
  duration?: LoanDuration;
  queryData?: Sort;
}) => {
  const wallet = useWallet();

  const [search, setSearch] = useState('');

  const fetchData = async ({ pageParam }: { pageParam: number }) => {
    const data = await fetchWalletBorrowNfts({
      publicKey: wallet.publicKey,
      limit: FETCH_LIMIT,
      offset: pageParam * FETCH_LIMIT,
      search,
      sortBy: 'maxLoanValue',
      sortOrder: 'desc',
      duration,
      loanType: duration === '0' ? LoanType.PRICE_BASED : LoanType.BOND,
    });

    return { pageParam, data };
  };

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'walletNfts',
        wallet?.publicKey?.toBase58(),
        search,
        duration,
        queryData,
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
  };
};

type UseMaxBorrow = (props: { walletPublicKey?: web3.PublicKey }) => {
  maxBorrow: MaxBorrow;
  isLoading: boolean;
};
export const useMaxBorrow: UseMaxBorrow = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['maxBorrow', walletPublicKey?.toBase58()],
    () =>
      fetchMaxBorrowValuePro({
        publicKey: walletPublicKey,
      }),
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    maxBorrow: data,
    isLoading,
  };
};
