import create from 'zustand';

import { formatSortOrderToNormalValue } from '../../../helpers';

interface BondsSortState {
  setSortQuery: (value: any) => void;
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
        sortBy: column.dataIndex || 'nftName',
      },
    })),
}));
