import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { SortModalMobileProps } from '../SortModalMobile';

type UseSortModalMobile = <T>(props: {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  defaultField?: string;
}) => {
  modal: SortModalMobileProps<T>;
  sortedData: T[];
};

export const useSortModalMobile: UseSortModalMobile = ({
  data,
  columns,
  defaultField,
}) => {
  const [sortModalMobileVisible, setSortModalMobileVisible] = useState(false);
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
      sortModalMobileVisible,
      setSortModalMobileVisible,
      sort,
      setSort,
      columns,
    },
    sortedData,
  };
};
