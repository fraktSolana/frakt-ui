import { useMemo, useState } from 'react';
import { DebouncedFunc, debounce } from 'lodash';

import { flatObject } from '@frakt/utils';

type Event = { target: { value: string } };

type UseSearch = <T>(props: {
  data: ReadonlyArray<T>;
  searchField?: string | string[];
  debounceWait?: number;
}) => {
  filteredData: ReadonlyArray<T>;
  onChange: DebouncedFunc<(event: Event) => void>;
};

export const useSearch: UseSearch = ({
  data,
  searchField = 'name',
  debounceWait = 0,
}) => {
  const [search, setSearch] = useState<string>('');

  const filtering = (filteredString = '') =>
    filteredString.toUpperCase().includes(search.toUpperCase());

  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((dataElement) => {
      if (typeof searchField === 'string') {
        return filtering(dataElement[searchField]);
      }
      const flattedObject = flatObject(dataElement);
      return filtering(flattedObject[searchField[0]]);
    });
  }, [search, data, searchField]);

  return {
    filteredData,
    onChange: debounce(
      (event: Event) => setSearch(event.target.value || ''),
      debounceWait,
    ),
  };
};
