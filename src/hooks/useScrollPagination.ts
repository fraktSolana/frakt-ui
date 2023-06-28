import { useEffect, useRef, useState } from 'react';
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

const MARGIN_ROOT_PX = 10;

export const useScrollPagination = <T>({
  selector,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseScrollPaginationOptions<T>) => {
  const scrollContainerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const { scrollHeight, scrollTop, clientHeight } = scrollContainer;
      const isScrollEnd =
        scrollHeight - scrollTop - MARGIN_ROOT_PX < clientHeight;

      const canFetchNextPage = hasNextPage && !isFetchingNextPage;

      if (isScrollEnd && canFetchNextPage) {
        setIsLoading(true);
        fetchNextPage().then(() => {
          setIsLoading(false);
        });
      }
    }
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(selector);

    if (scrollContainer) {
      scrollContainerRef.current = scrollContainer;
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selector, hasNextPage, isFetchingNextPage, fetchNextPage, handleScroll]);

  return { isLoading };
};

export default useScrollPagination;
