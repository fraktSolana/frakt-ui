import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { LiquidityPool } from '@frakt/api/pools';
import {
  createPercentValueJSX,
  createHeaderCell,
  createSolValueJSX,
} from '@frakt/components/TableComponents';

import { CollectionInfoCell, DepositCell } from './LendTableCells';

export type SortColumns = {
  column: ColumnType<LiquidityPool>;
  order: SortOrder;
}[];
export const getTableColumns = (
  isCardView: boolean,
): ColumnsType<LiquidityPool> => [
  {
    key: 'name',
    dataIndex: 'name',
    title: (column) =>
      createHeaderCell(column, 'Name', 'name', null, true, true),
    render: (_, liquidityPool) => (
      <CollectionInfoCell liquidityPool={liquidityPool} />
    ),
    sorter: true,
    showSorterTooltip: false,
  },
  {
    key: 'totalLiquidity',
    dataIndex: 'totalLiquidity',
    title: (column) =>
      createHeaderCell(column, 'Total liquidity', 'totalLiquidity'),
    render: (_, { totalLiquidity }) =>
      createSolValueJSX(parseFloat(totalLiquidity.toFixed(2)), false),
    sorter: true,
    showSorterTooltip: false,
  },
  {
    key: 'depositYield',
    dataIndex: 'depositYield',
    title: (column) =>
      createHeaderCell(
        column,
        'Deposit yield',
        'depositYield',
        'Yearly rewards based on the current utilization rate and borrow interest',
      ),
    render: (_, { depositApr }) => createPercentValueJSX(depositApr),
    sorter: true,
    showSorterTooltip: false,
  },
  {
    key: 'interest',
    dataIndex: 'interest',
    title: (column) =>
      createHeaderCell(
        column,
        'Borrow interest',
        'interest',
        'The current yearly interest rate paid by borrowers based on the current utilization rate',
      ),
    render: (_, { borrowApr, isPriceBased }) =>
      createPercentValueJSX(isPriceBased ? borrowApr : borrowApr * 52),
  },
  {
    key: 'totalBorrowed',
    dataIndex: 'totalBorrowed',
    title: (column) =>
      createHeaderCell(column, 'Total borrowed', 'totalBorrowed'),
    render: (_, { totalBorrowed }) =>
      createSolValueJSX(parseFloat(totalBorrowed.toFixed(2)), false),
  },
  {
    key: 'userLiquidity',
    dataIndex: 'userLiquidity',
    title: (column) =>
      createHeaderCell(column, 'Your liquidity', 'userLiquidity'),
    render: (_, { userDeposit }) =>
      createSolValueJSX(userDeposit?.depositAmount, false),
  },
  {
    key: 'rewards',
    dataIndex: 'rewards',
    title: (column) => createHeaderCell(column, 'Rewards', 'rewards'),
    render: (_, { userDeposit }) =>
      createSolValueJSX(
        parseFloat(userDeposit?.harvestAmount?.toFixed(2)),
        false,
      ),
  },
  {
    render: (_, liquidityPool) => (
      <DepositCell liquidityPool={liquidityPool} isCardView={isCardView} />
    ),
  },
];
