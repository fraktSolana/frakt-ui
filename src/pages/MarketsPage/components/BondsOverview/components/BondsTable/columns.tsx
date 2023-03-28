import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Bond } from '@frakt/api/bonds';

import {
  ExperationCell,
  TitleCell,
  SizeCell,
  InterestCell,
  ProfitCell,
  HeaderTitleCell,
  PnlProfitCell,
  ExitCell,
} from './TableCells';

export type SortColumns = {
  column: ColumnType<Bond>;
  order: SortOrder;
}[];

export const TableList = ({ data, hideBond }) => {
  const COLUMNS: ColumnsType<Bond> = [
    {
      key: 'nftName',
      dataIndex: 'nftName',
      title: (column) => (
        <HeaderTitleCell
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
      render: (_, bond: Bond) => <TitleCell bond={bond} />,
      defaultSortOrder: 'ascend',
      fixed: 'left',
      showSorterTooltip: false,
    },
    {
      key: 'size',
      dataIndex: 'size',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Size"
          value="size"
          tooltipText="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
        />
      ),
      sorter: ({ stats: statsA, stats: statsB }) => statsA.size - statsB.size,
      render: (_, { stats }) => (
        <SizeCell ltv={stats?.ltv} size={stats?.size} />
      ),
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderTitleCell
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
        statsA.interest - statsB.interest,
      showSorterTooltip: false,
    },
    {
      key: 'setProfit',
      dataIndex: 'setProfit',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          value="setProfit"
          label="Est. Profit"
          tooltipText="Analyzed profit from repaying the loan"
        />
      ),
      sorter: ({ stats: statsA, stats: statsB }) =>
        statsA.estProfit - statsB.estProfit,
      render: (_, bond: Bond) => <ProfitCell bond={bond} />,
      showSorterTooltip: false,
    },
    {
      key: 'expiration',
      dataIndex: 'expiration',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Expiration"
          value="expiration"
          tooltipText="When the loan is paid back or liquidated"
        />
      ),
      render: (_, bond: Bond) => (
        <ExperationCell liquidatingAt={bond?.stats?.expiration} />
      ),
      sorter: (a, b) => a.stats.expiration - b.stats.expiration,
      showSorterTooltip: false,
    },
    {
      key: 'pnl',
      dataIndex: 'pnl',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          value="pnl"
          label="PNL"
          tooltipText="Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”)"
        />
      ),
      sorter: ({ stats: statsA, stats: statsB }) => statsA.pnl - statsB.pnl,
      render: (_, bond: Bond) => <PnlProfitCell bond={bond} />,
      showSorterTooltip: false,
    },
    {
      render: (_, bond: Bond) => (
        <ExitCell bonds={data} hideBond={hideBond} bond={bond} />
      ),
    },
  ];

  return COLUMNS;
};
