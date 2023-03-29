import { Bond } from '@frakt/api/bonds';
import { SortOrder } from 'antd/lib/table/interface';
import { ColumnType } from 'antd/es/table';
import create from 'zustand';

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
  setSortQuery: ({ order = 'desc', column }) =>
    set((state) => ({
      ...state,
      queryData: {
        order: formatSortOrderToNormalValue(order),
        sortBy: column.dataIndex?.toString() || 'nftName',
      },
    })),
}));
