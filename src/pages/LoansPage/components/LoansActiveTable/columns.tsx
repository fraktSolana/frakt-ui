import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Loan } from '@frakt/api/loans';
import {
  createHighlitedPercentValueJSX,
  createPercentValueJSX,
  createSolValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import { useSelectedLoans } from '../../loansState';
import {
  DurationCell,
  MoreActionsCell,
  CollectionInfoCell,
  StakingLoanCell,
} from './LoansTableCells';

import styles from './LoansTable.module.scss';

export type SortColumns = {
  column: ColumnType<Loan>;
  order: SortOrder;
  isCardView: boolean;
}[];

export const TableList = ({ isCardView }) => {
  const { findLoanInSelection } = useSelectedLoans();

  const COLUMNS: ColumnsType<Loan> = [
    {
      title: (column) => (
        <div className={styles.rowCenter}>
          <HeaderCell column={column} label="Borrowed" value="loanValue" />
        </div>
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
      key: 'loanValue',
      dataIndex: 'loanValue',
      title: (column) => (
        <HeaderCell column={column} label="Borrowed" value="loanValue" />
      ),
      render: (_, { loanValue }) => createSolValueJSX(loanValue),
    },
    {
      key: 'repayValue',
      dataIndex: 'repayValue',
      title: (column) => (
        <HeaderCell column={column} label="Debt" value="repayValue" />
      ),
      render: (_, { repayValue }) => createSolValueJSX(repayValue),
    },
    {
      key: 'liquidationPrice',
      dataIndex: 'liquidationPrice',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Liquidation price"
          value="liquidationPrice"
        />
      ),
      render: (_, { classicParams }) =>
        createSolValueJSX(classicParams?.priceBased?.liquidationPrice),
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderCell column={column} label="Borrow interest" value="interest" />
      ),
      render: (_, { classicParams }) =>
        createPercentValueJSX(classicParams?.priceBased?.borrowAPRPercent),
    },
    {
      key: 'health',
      dataIndex: 'health',
      title: (column) => (
        <HeaderCell column={column} label="Health" value="health" />
      ),
      render: (_, { classicParams }) =>
        createHighlitedPercentValueJSX(classicParams?.priceBased?.health),
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: (column) => (
        <HeaderCell column={column} label="Duration" value="duration" />
      ),
      render: (_, loan) => <DurationCell loan={loan} />,
      showSorterTooltip: false,
      defaultSortOrder: 'ascend',
    },
    {
      render: (_, loan) => <StakingLoanCell loan={loan} />,
    },
    {
      render: (_, loan) => (
        <MoreActionsCell loan={loan} isCardView={isCardView} />
      ),
    },
  ];

  return COLUMNS;
};
