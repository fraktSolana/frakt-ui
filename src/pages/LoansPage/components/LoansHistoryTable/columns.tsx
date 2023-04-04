import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Loan } from '@frakt/api/loans';
import {
  CollectionInfoCell,
  createPercentValueJSX,
  createSolValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import { DurationCell } from '../LoansTable/LoansTableCells';

export type SortColumns = {
  column: ColumnType<Loan>;
  order: SortOrder;
}[];

export const COLUMNS: ColumnsType<Loan> = [
  {
    title: (column) => (
      <HeaderCell
        column={column}
        label="Collateral"
        value="nftName"
        fixedLeft
      />
    ),
    render: (_, { nft }) => (
      <CollectionInfoCell nftName={nft.name} nftImage={nft.imageUrl} />
    ),
  },
  {
    key: 'loanValue',
    dataIndex: 'loanValue',
    title: (column) => (
      <HeaderCell column={column} label="Borrowed" value="loanValue" />
    ),
    sorter: ({ loanValue: loanValueA }, { loanValue: loanValueB }) =>
      loanValueA - loanValueB,
    render: (_, { loanValue }) => createSolValueJSX(loanValue),
    showSorterTooltip: false,
    defaultSortOrder: 'ascend',
  },
  {
    key: 'repayValue',
    dataIndex: 'repayValue',
    title: (column) => (
      <HeaderCell column={column} label="Debt" value="repayValue" />
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
      <HeaderCell column={column} label="Status" value="status" />
    ),
    render: (_, { classicParams }) =>
      createPercentValueJSX(classicParams?.priceBased?.health),
    showSorterTooltip: false,
  },
  {
    key: 'when',
    dataIndex: 'when',
    title: (column) => (
      <HeaderCell column={column} label="When" value="duration" />
    ),
    render: (_, loan) => <DurationCell loan={loan} />,
    showSorterTooltip: false,
  },
];
