import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';

import { SortDropdownProps } from '../components/SortDropdown';

type UseSortDropdownModal = <T>(props: {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  defaultField?: string;
}) => {
  modal: SortDropdownProps<T>;
  sortedData: T[];
};

export const useSortDropdownModal: UseSortDropdownModal = ({
  data,
  columns,
  defaultField,
}) => {
  const [sort, setSort] = useState<{
    field: string | null;
    direction: 'desc' | 'asc';
  }>({
    field: defaultField || null,
    direction: 'desc',
  });

  const sortedData = useMemo(() => {
    if (!sort.field) return [...data];
    const sortFunction = columns.find(({ key }) => String(key) === sort.field)
      ?.sorter as any;

    if (!sortFunction) return [...data];

    if (sort.direction === 'desc') {
      return [...data].sort(sortFunction).reverse();
    }
    return [...data].sort(sortFunction);
  }, [sort, data, columns]);

  return {
    modal: {
      sort,
      setSort,
      columns,
    },
    sortedData,
  };
};
