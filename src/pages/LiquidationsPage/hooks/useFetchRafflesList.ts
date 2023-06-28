import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  ifElse,
  isEmpty,
  compose,
  concat,
  join,
  map,
  toPairs,
  pickBy,
  allPass,
} from 'ramda';
import { isNotEmpty, isNotNil } from 'ramda-adjunct';

import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { FetchItemsParams } from '@frakt/api/raffle';

const LIMIT = 20;

const baseUrl = `https://${process.env.BACKEND_DOMAIN}`;

const stringify = ifElse(
  isEmpty,
  () => '',
  compose(
    concat('?'),
    join('&'),
    map(join('=')),
    toPairs,
    pickBy(allPass([isNotNil, isNotEmpty])),
  ),
);

export const useFetchRafflesList = (params: {
  url: string;
  id: string;
  queryData: FetchItemsParams;
}): {
  data: any[];
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<{
      pageParam: number;
      data: any[];
    }>
  >;
  isFetchingNextPage: boolean;
  isListEnded: boolean;
  isLoading: boolean;
} => {
  const { publicKey } = useWallet();

  const { url, id, queryData } = params;
  const queryString = stringify(queryData);

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    queryString,
  }: {
    pageParam: number;
    queryString: string;
  }) => {
    const queryUrl = `${baseUrl}/${url}${queryString}&limit=${LIMIT}&skip=${
      LIMIT * pageParam
    }`.replace('&?', '&');

    const data = await (await fetch(queryUrl)).json();

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
      queryKey: [publicKey, queryData, id],
      enabled: !!queryData,
      queryFn: ({ pageParam = 0 }) => fetchData({ pageParam, queryString }),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.data.length !== 0 ? nextPage : undefined;
      },
      refetchInterval: 5000,
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
    });

  const rafflesData = data?.pages?.map((page) => page.data).flat() || [];

  return {
    data: rafflesData,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    isLoading: isLoading && !rafflesData?.length,
  };
};
