import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Loan, LoanType } from '@frakt/api/loans';
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
          <HeaderCell
            column={column}
            label="Collateral"
            value="collateral"
            hiddenSort
          />
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
        <HeaderCell
          column={column}
          label="Borrowed"
          value="loanValue"
          hiddenSort
        />
      ),
      render: (_, { loanValue }) => createSolValueJSX(loanValue),
      sorter: ({ loanValue: loanValueA }, { loanValue: loanValueB }) =>
        loanValueA - loanValueB,
      showSorterTooltip: false,
    },
    {
      key: 'repayValue',
      dataIndex: 'repayValue',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Debt"
          value="repayValue"
          hiddenSort
        />
      ),
      render: (_, { repayValue }) => createSolValueJSX(repayValue),
      sorter: ({ repayValue: repayValueA }, { repayValue: repayValueB }) =>
        repayValueA - repayValueB,
      showSorterTooltip: false,
    },
    {
      key: 'liquidationPrice',
      dataIndex: 'liquidationPrice',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Liquidation price"
          value="liquidationPrice"
          hiddenSort
        />
      ),
      render: (_, { classicParams }) =>
        createSolValueJSX(classicParams?.priceBased?.liquidationPrice),
      sorter: (
        { classicParams: classicParamsA },
        { classicParams: classicParamsB },
      ) =>
        classicParamsA?.priceBased?.liquidationPrice -
        classicParamsB?.priceBased?.liquidationPrice,
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Borrow interest"
          value="interest"
          hiddenSort
        />
      ),
      render: (_, { classicParams }) =>
        createPercentValueJSX(classicParams?.priceBased?.borrowAPRPercent),
      sorter: (
        { classicParams: classicParamsA },
        { classicParams: classicParamsB },
      ) =>
        classicParamsA?.priceBased?.borrowAPRPercent -
        classicParamsB?.priceBased?.borrowAPRPercent,
      showSorterTooltip: false,
    },
    {
      key: 'health',
      dataIndex: 'health',
      title: (column) => (
        <HeaderCell column={column} label="Health" value="health" hiddenSort />
      ),
      render: (_, { classicParams }) =>
        createHighlitedPercentValueJSX(classicParams?.priceBased?.health),
      sorter: (
        { classicParams: classicParamsA },
        { classicParams: classicParamsB },
      ) =>
        classicParamsA?.priceBased?.health - classicParamsB?.priceBased?.health,
      showSorterTooltip: false,
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Duration"
          value="duration"
          hiddenSort
        />
      ),
      render: (_, loan) => <DurationCell loan={loan} />,
      showSorterTooltip: false,
      defaultSortOrder: 'ascend',
      sorter: (loanA, loanB) => {
        if (loanA.loanType === LoanType.PRICE_BASED) return 1;
        if (loanB.loanType === LoanType.PRICE_BASED) return -1;

        const timeToRepayA =
          loanA?.classicParams?.timeBased?.expiredAt ||
          loanA?.bondParams?.expiredAt;

        const timeToRepayB =
          loanB?.classicParams?.timeBased?.expiredAt ||
          loanB?.bondParams?.expiredAt;

        return timeToRepayA - timeToRepayB;
      },
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
