import { useEffect } from 'react';
import { debounce } from 'lodash';
import {
  InfiniteQueryObserverResult,
  FetchNextPageOptions,
} from '@tanstack/react-query';

type FetchNextPageFunction<T> = (options?: FetchNextPageOptions) => Promise<
  InfiniteQueryObserverResult<
    {
      pageParam: number;
      data: T[];
    },
    unknown
  >
>;

type UseScrollPaginationOptions<T> = {
  selector: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: FetchNextPageFunction<T>;
};

const MARGIN_ROOT = 10;

export const useScrollPagination = <T>({
  selector,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseScrollPaginationOptions<T>) => {
  useEffect(() => {
    const tableContent = document.querySelector(selector);
    const debouncedFetchNextPage = debounce(fetchNextPage, 200);

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = tableContent;
      const isScrollEnd = scrollHeight - scrollTop - MARGIN_ROOT < clientHeight;

      const canFetchNextPage = hasNextPage && !isFetchingNextPage;

      if (isScrollEnd && canFetchNextPage) {
        debouncedFetchNextPage();
      }
    };

    if (tableContent) {
      tableContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (tableContent) {
        tableContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selector, hasNextPage, isFetchingNextPage, fetchNextPage]);
};

export default useScrollPagination;
