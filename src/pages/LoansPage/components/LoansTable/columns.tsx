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
import { RepayLoanCell, DurationCell } from './LoansTableCells';

import styles from './LoansTable.module.scss';
import Checkbox from '@frakt/components/Checkbox/Checkbox';

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
    },
    {
      key: 'health',
      dataIndex: 'health',
      title: (column) => (
        <HeaderCell column={column} label="Health" value="health" />
      ),
      render: (_, { classicParams }) =>
        createPercentValueJSX(classicParams?.priceBased?.health),
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
        <HeaderCell column={column} label="Duration" value="duration" />
      ),
      render: (_, loan) => <DurationCell loan={loan} />,
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
