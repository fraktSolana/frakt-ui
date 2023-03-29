import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Bond } from '@frakt/api/bonds';

import { InterestCell, SizeCell } from '../BondsTable/TableCells';
import {
  HeaderCell,
  CollateralCell,
  createReceiveJSX,
  createliquidatingAtJSX,
} from './TableCells';

export type SortColumns = {
  column: ColumnType<Bond>;
  order: SortOrder;
}[];

export const COLUMNS: ColumnsType<Bond> = [
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
    sorter: ({
      collateralBox: collateralBoxA,
      collateralBox: collateralBoxB,
    }) => collateralBoxB.nft.name?.localeCompare(collateralBoxA.nft.name),
    render: (_, bond: Bond) => <CollateralCell bond={bond} />,
    defaultSortOrder: 'ascend',
    showSorterTooltip: false,
    fixed: 'left',
  },
  {
    key: 'size',
    dataIndex: 'size',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        label="Size"
        value="size"
        tooltipText="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
      />
    ),
    sorter: ({ stats: statsA, stats: statsB }) => statsA.size - statsB.size,
    render: (_, { stats }) => <SizeCell ltv={stats?.ltv} size={stats?.size} />,
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
    key: 'autocompound',
    dataIndex: 'autocompound',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        value="autocompound"
        label="Autocompound"
        tooltipText="Analyzed profit from repaying the loan"
        removeSort
      />
    ),
    render: (_, { stats }) => createReceiveJSX(stats?.received),
  },
  {
    key: 'received',
    dataIndex: 'received',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        label="Received"
        value="received"
        tooltipText="When the loan is paid back or liquidated"
      />
    ),
    render: (_, { stats }) => createReceiveJSX(stats?.received),
    sorter: ({ stats: statsA, stats: statsB }) =>
      statsA.received - statsB.received,
    showSorterTooltip: false,
  },
  {
    key: 'when',
    dataIndex: 'when',
    title: (column) => (
      <HeaderCell sortColumns={column?.sortColumns} value="when" label="When" />
    ),
    sorter: ({ stats: statsA, stats: statsB }) => statsA.when - statsB.when,
    render: (_, { stats }) => createliquidatingAtJSX(stats?.when),
    showSorterTooltip: false,
  },
];
