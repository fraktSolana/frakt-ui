import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { BondHistory } from '@frakt/api/bonds';

import { InterestCell, SizeCell } from '../BondsTable/TableCells';
import {
  HeaderCell,
  CollateralCell,
  createliquidatingAtJSX,
  createAutocompoundJSX,
  ReceiveCell,
} from './TableCells';

export type SortColumns = {
  column: ColumnType<BondHistory>;
  order: SortOrder;
}[];

export const COLUMNS: ColumnsType<BondHistory> = [
  {
    key: 'nftName',
    dataIndex: 'nftName',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        label="Collateral"
        value="nftName"
        fixedLeft
      />
    ),
    sorter: ({ lightMeta: lightMetaA, lightMeta: lightMetaB }) =>
      lightMetaB.name?.localeCompare(lightMetaA.name),
    render: (_, bond: BondHistory) => (
      <CollateralCell lightMeta={bond.lightMeta} />
    ),
    showSorterTooltip: false,
  },
  {
    key: 'size',
    dataIndex: 'size',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        label="Lent"
        value="size"
        tooltipText="Amount of SOL that was lent at the chosen LTV & APY"
      />
    ),
    sorter: ({ stats: statsA, stats: statsB }) => statsA.size - statsB.size,
    render: (_, { stats }) => (
      <SizeCell ltv={stats.loanToReturnValue} size={stats?.size} />
    ),
    showSorterTooltip: false,
  },
  {
    key: 'interest',
    dataIndex: 'interest',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        label="Interest"
        value="interest"
        tooltipText="Interest (in %) for the duration of this loan"
      />
    ),

    render: (_, { stats }) => (
      <InterestCell interest={stats?.interest} apy={stats?.apy} />
    ),
    sorter: ({ stats: statsA, stats: statsB }) =>
      statsA.expiration - statsB.expiration,
    showSorterTooltip: false,
  },
  {
    key: 'state',
    dataIndex: 'state',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        value="state"
        label="Status"
        removeSort
      />
    ),
    render: (_, { stats }) => createAutocompoundJSX(stats?.state),
    width: 110,
  },
  {
    key: 'received',
    dataIndex: 'received',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        label="Received"
        value="received"
        tooltipText="Lender's profit or loss"
      />
    ),
    render: (_, { stats }) => <ReceiveCell stats={stats} />,
    sorter: ({ stats: statsA, stats: statsB }) =>
      (typeof statsA.received === 'string' ? 0 : (statsA.received as any)) -
      (typeof statsB.received === 'string' ? 0 : (statsB.received as any)),
    showSorterTooltip: false,
  },
  {
    key: 'when',
    dataIndex: 'when',
    title: (column) => (
      <HeaderCell sortColumns={column?.sortColumns} value="when" label="When" />
    ),
    sorter: ({ stats: statsA, stats: statsB }) => statsA.when - statsB.when,
    render: (_, { stats, eventSignature }) =>
      createliquidatingAtJSX(stats?.when, eventSignature),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    width: 120,
  },
];
