import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Search } from '@frakt/components/Table/Search';
import { Loan } from '@frakt/api/loans';
import {
  CollectionInfoCell,
  createPercentValueJSX,
  createSolValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import MoreActionsCell from './LoansTableCells/MoreActionsCell';
import { useSelectedLoans } from '../../loansState';
import { RepayLoanCell } from './LoansTableCells';

import styles from './LoansTable.module.scss';

export type SortColumns = {
  column: ColumnType<Loan>;
  order: SortOrder;
}[];

export const TableList = ({ onChange }) => {
  const { findLoanInSelection } = useSelectedLoans();

  const COLUMNS: ColumnsType<Loan> = [
    {
      key: 'collectionName',
      dataIndex: 'collectionName',
      title: () => (
        <Search
          placeHolderText="Search by name"
          className={styles.searchInput}
          onChange={onChange}
        />
      ),
      render: (_, { nft, pubkey }) => (
        <CollectionInfoCell
          nftName={nft.name}
          nftImage={nft.imageUrl}
          selected={!!findLoanInSelection(pubkey)}
        />
      ),
    },
    {
      key: 'debt',
      dataIndex: 'debt',
      title: (column) => (
        <HeaderCell column={column} label="Debt" value="debt" />
      ),
      sorter: ({ repayValue: repayValueA, repayValue: repayValueB }) =>
        repayValueA - repayValueB,
      render: (_, { repayValue }) => createSolValueJSX(repayValue),
      showSorterTooltip: false,
    },
    {
      key: 'LiquidationPrice',
      dataIndex: 'LiquidationPrice',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Liquidation price"
          value="LiquidationPrice"
        />
      ),
      render: (_, { repayValue }) => createSolValueJSX(repayValue),
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderCell column={column} label="Borrow interest" value="interest" />
      ),
      render: (_) => createPercentValueJSX(0),
      showSorterTooltip: false,
    },
    {
      key: 'health',
      dataIndex: 'health',
      title: (column) => (
        <HeaderCell column={column} label="Health" value="health" />
      ),
      render: (_) => createPercentValueJSX(0),
      showSorterTooltip: false,
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: (column) => (
        <HeaderCell column={column} label="Duration" value="duration" />
      ),
      render: (_) => createSolValueJSX(0),
      showSorterTooltip: false,
    },
    {
      render: (_, loan) => <RepayLoanCell loan={loan} />,
    },
    {
      render: (_, loan) => <MoreActionsCell loan={loan} />,
    },
  ];

  return COLUMNS;
};
