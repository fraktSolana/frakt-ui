import { DebouncedFunc, get } from 'lodash';

import { TableProps } from './../Table';
import { PartialSearchParams, TablePropsWithSortProps } from '../types';
import { useSearch } from './useSearch';

type Event = { target: { value: string } };

interface UseTableProps<T> extends TableProps<T> {
  searchParams?: PartialSearchParams;
}

type UseTable = <T>(props: UseTableProps<T>) => {
  table: TablePropsWithSortProps<T>;
  search: {
    placeHolderText?: string;
    onChange: DebouncedFunc<(event: Event) => void>;
  };
};

export const useTable: UseTable = ({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  loading,
  searchParams = {
    debounceWait: 100,
    searchField: 'name',
    placeHolderText: 'Search by name',
  },
}) => {
  const { filteredData, onChange } = useSearch({
    data,
    searchField: get(searchParams, 'searchField', 'name'),
    debounceWait: get(searchParams, 'debounceWait', 100),
  });

  const search = {
    placeHolderText: get(searchParams, 'placeHolderText', 'Search by name'),
    onChange,
  };

  const table = {
    data: filteredData,
    columns,
    onRowClick,
    rowKeyField,
    loading,
  };

  return { table, search };
};
