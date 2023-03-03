import { useMemo, useState } from 'react';
import { debounce, DebouncedFunc } from 'lodash';
import { flatObject } from '@frakt/utils';

type UseSearch = <T>(props: {
  data: ReadonlyArray<T>;
  searchField?: string | string[];
  debounceWait?: number;
}) => {
  filteredData: any;
  onChange: DebouncedFunc<(event: any) => void>;
};

export const useSearch: UseSearch = ({
  data,
  searchField = 'name',
  debounceWait = 0,
}) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((dataElement) => {
      if (typeof searchField === 'string') {
        return (dataElement[searchField] ?? '')
          .toUpperCase()
          .includes(search.toUpperCase());
      } else {
        const flattedObject = flatObject(dataElement) as any;

        return flattedObject[searchField[0] ?? '']
          .toUpperCase()
          .includes(search.toUpperCase());
      }
    });
  }, [search, data, searchField]);

  return {
    filteredData,
    onChange: debounce(
      (event) => setSearch(event.target.value || ''),
      debounceWait,
    ),
  };
};
