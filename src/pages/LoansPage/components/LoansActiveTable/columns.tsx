import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Search } from '@frakt/components/Table/Search';
import Checkbox from '@frakt/components/Checkbox';
import { Loan, LoanType } from '@frakt/api/loans';
import {
  createHighlitedPercentValueJSX,
  createPercentValueJSX,
  createSolValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import { useSelectedLoans } from '../../loansState';
import {
  RepayLoanCell,
  DurationCell,
  MoreActionsCell,
  StakingSupportCell,
  CollectionInfoCell,
} from './LoansTableCells';

import styles from './LoansTable.module.scss';

export type SortColumns = {
  column: ColumnType<Loan>;
  order: SortOrder;
}[];

export const TableList = ({ onChange, data }) => {
  const { findLoanInSelection, setSelection, selection, clearSelection } =
    useSelectedLoans();

  const onChangeCheckbox = (): void => {
    if (selection?.length) {
      clearSelection();
    } else {
      setSelection(data);
    }
  };

  const COLUMNS: ColumnsType<Loan> = [
    {
      title: () => (
        <div className={styles.rowCenter}>
          <Checkbox
            className={styles.checkbox}
            classNameInnerContent={styles.checkboxInnerContent}
            onChange={onChangeCheckbox}
            checked={!!selection?.length}
          />
          <Search
            placeHolderText="Search by name"
            className={styles.searchInput}
            onChange={onChange}
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
      width: 177,
    },
    {
      render: (_, loan) => <StakingSupportCell loan={loan} />,
      width: 103,
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
      width: 92,
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
      width: 88,
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
      sorter: (
        { classicParams: classicParamsA },
        { classicParams: classicParamsB },
      ) =>
        classicParamsA?.priceBased?.liquidationPrice -
        classicParamsB?.priceBased?.liquidationPrice,
      showSorterTooltip: false,
      width: 136,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderCell column={column} label="Borrow interest" value="interest" />
      ),
      sorter: (
        { classicParams: classicParamsA },
        { classicParams: classicParamsB },
      ) =>
        classicParamsA?.priceBased?.borrowAPRPercent -
        classicParamsB?.priceBased?.borrowAPRPercent,
      render: (_, { classicParams }) =>
        createPercentValueJSX(classicParams?.priceBased?.borrowAPRPercent),
      showSorterTooltip: false,
      width: 136,
    },
    {
      key: 'health',
      dataIndex: 'health',
      title: (column) => (
        <HeaderCell column={column} label="Health" value="health" />
      ),
      render: (_, { classicParams }) =>
        createHighlitedPercentValueJSX(classicParams?.priceBased?.health),
      sorter: (
        { classicParams: classicParamsA },
        { classicParams: classicParamsB },
      ) =>
        classicParamsA?.priceBased?.health - classicParamsB?.priceBased?.health,
      showSorterTooltip: false,
      width: 72,
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: (column) => (
        <HeaderCell column={column} label="Duration" value="duration" />
      ),
      render: (_, loan) => <DurationCell loan={loan} />,
      showSorterTooltip: false,
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
      defaultSortOrder: 'ascend',
      width: 118,
    },
    {
      render: (_, loan) => <RepayLoanCell loan={loan} />,
      width: 60,
    },
    {
      render: (_, loan) => <MoreActionsCell loan={loan} />,
      width: 32,
    },
  ];

  return COLUMNS;
};
