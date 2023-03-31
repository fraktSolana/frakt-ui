import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Bond } from '@frakt/api/bonds';

import { InterestCell, SizeCell } from '../BondsTable/TableCells';
import {
  HeaderCell,
  CollateralCell,
  createliquidatingAtJSX,
  createAutocompoundJSX,
  ReceiveCell,
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
    showSorterTooltip: false,
    fixed: 'left',
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
    key: 'status',
    dataIndex: 'status',
    title: (column) => (
      <HeaderCell
        sortColumns={column?.sortColumns}
        value="status"
        label="Status"
        removeSort
      />
    ),
    render: (_, { stats }) => createAutocompoundJSX(stats?.status),
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
    defaultSortOrder: 'descend',
  },
];
