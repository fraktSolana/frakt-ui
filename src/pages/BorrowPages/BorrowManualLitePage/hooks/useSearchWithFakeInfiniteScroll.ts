import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

import { useIntersection } from '@frakt/hooks/useIntersection';

interface UseSearchWithFakeInfiniteScrollProps<T> {
  itemsPerScroll?: number;
  rawData: Array<T>;
  searchFunc: (dataItem: T, search: string) => boolean;
  enabled?: boolean;
}

export const useSearchWithFakeInfiniteScroll = <T>({
  itemsPerScroll = 20,
  rawData = [],
  searchFunc,
  enabled = true,
}: UseSearchWithFakeInfiniteScrollProps<T>) => {
  const { ref, inView } = useIntersection();
  const [search, setSearch] = useState('');
  const [itemsToShow, setItemsToShow] = useState<number>(itemsPerScroll);

  //? Reset visible elements when search changed
  useEffect(() => {
    setItemsToShow(itemsPerScroll);
  }, [search, itemsPerScroll, rawData]);

  const searchedData = useMemo(() => {
    if (!search) return rawData.slice(0, itemsToShow);

    return rawData
      .filter((dataItem) => searchFunc(dataItem, search))
      .slice(0, itemsToShow);
  }, [rawData, search, searchFunc, itemsToShow]);

  const next = debounce(
    (itemsToShow: number) => setItemsToShow(() => itemsToShow + itemsPerScroll),
    300,
  );

  useEffect(() => {
    if (inView && rawData.length >= itemsToShow) {
      next(itemsToShow);
    }
  }, [inView, next, rawData, itemsToShow]);

  return {
    data: enabled ? searchedData : rawData,
    setSearch,
    fetchMoreTrigger: ref,
  };
};
