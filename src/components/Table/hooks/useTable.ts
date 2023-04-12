import { DebouncedFunc } from 'lodash';

import { TableProps, TablePropsWithSortModalMobileProps } from './../Table';
import { useSortModalMobile } from '../hooks';
import { PartialSearchParams } from '../types';
import { useSearch } from './useSearch';

type Event = { target: { value: string } };

interface UseTableProps<T> extends TableProps<T> {
  searchParams?: PartialSearchParams;
}

type UseTable = <T>(props: UseTableProps<T>) => {
  table: TablePropsWithSortModalMobileProps<T>;
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
  noDataMessage,
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

  const { modal: sortModalMobile, sortedData } = useSortModalMobile({
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
      noDataMessage,
      ...sortModalMobile,
    },
    search: {
      placeHolderText: searchParams.placeHolderText ?? 'Search by name',
      onChange,
    },
  };
};
