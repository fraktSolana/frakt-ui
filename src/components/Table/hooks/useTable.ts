import { DebouncedFunc } from 'lodash';

import { TableProps, TablePropsWithSortProps } from './../Table';
import { useSortDropdownModal } from '../hooks';
import { PartialSearchParams } from '../types';
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
  defaultField,
  searchParams = {
    debounceWait: 0,
    searchField: 'name',
    placeHolderText: 'Search by name',
  },
}) => {
  const { filteredData, onChange } = useSearch({
    data,
    searchField: searchParams.searchField ?? 'name',
    debounceWait: searchParams.debounceWait ?? 0,
  });

  const { modal: sortDropdownModal, sortedData } = useSortDropdownModal({
    data: filteredData,
    columns,
    defaultField,
  });

  return {
    table: {
      data: sortedData,
      columns,
      onRowClick,
      rowKeyField,
      loading,
      ...sortDropdownModal,
    },
    search: {
      placeHolderText: searchParams.placeHolderText ?? 'Search by name',
      onChange,
    },
  };
};
