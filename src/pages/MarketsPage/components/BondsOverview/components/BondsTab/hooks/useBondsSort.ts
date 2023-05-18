import { create } from 'zustand';
import { SortOrder } from 'antd/lib/table/interface';
import { ColumnType } from 'antd/es/table';

import { Bond } from '@frakt/api/bonds';

import { formatSortOrderToNormalValue } from '../../../helpers';

interface BondsSortState {
  setSortQuery: ({
    column,
    order,
  }: {
    column: ColumnType<Bond>;
    order: SortOrder;
  }) => void;
  queryData: {
    order: string;
    sortBy: string;
  };
}

export const useBondsSort = create<BondsSortState>((set) => ({
  queryData: null,
  setSortQuery: ({ order, column }) =>
    set((state) => ({
      ...state,
      queryData: {
        order: formatSortOrderToNormalValue(order),
        sortBy: column.dataIndex?.toString(),
      },
    })),
}));
