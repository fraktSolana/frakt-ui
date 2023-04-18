import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { LoansHistory } from '@frakt/api/loans';
import {
  createSolValueJSX,
  createValueJSX,
  createValueTimeJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import { CollectionInfoCell } from '../LoansActiveTable';

export type SortColumns = {
  column: ColumnType<LoansHistory>;
  order: SortOrder;
}[];

export const COLUMNS: ColumnsType<LoansHistory> = [
  {
    key: 'nftName',
    dataIndex: 'nftName',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Collateral"
        value="nftName"
        fixedLeft
        hiddenSort
      />
    ),
    render: (_, { nftName, nftImage }) => (
      <CollectionInfoCell nftName={nftName} nftImage={nftImage} />
    ),
  },
  {
    key: 'borrowed',
    dataIndex: 'borrowed',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Borrowed"
        value="borrowed"
        hiddenSort
      />
    ),
    sorter: ({ loanValue: loanValueA }, { loanValue: loanValueB }) =>
      loanValueA - loanValueB,
    render: (_, { loanValue }) => createSolValueJSX(loanValue),
    showSorterTooltip: false,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: (column) => (
      <HeaderCell column={column} label="Debt" value="debt" hiddenSort />
    ),
    sorter: ({ repayValue: repayValueA }, { repayValue: repayValueB }) =>
      repayValueA - repayValueB,
    render: (_, { repayValue }) => createSolValueJSX(repayValue),
    showSorterTooltip: false,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: (column) => (
      <HeaderCell column={column} label="Status" value="status" hiddenSort />
    ),
    render: (_, { status }) => createValueJSX(status),
    showSorterTooltip: false,
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: (column) => (
      <HeaderCell column={column} label="When" value="date" hiddenSort />
    ),
    sorter: ({ when: whenA, when: whenB }) => whenA - whenB,
    render: (_, { when }) => createValueTimeJSX(when),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    width: 136,
  },
];
