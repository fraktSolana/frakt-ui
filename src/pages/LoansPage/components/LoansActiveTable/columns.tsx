import { ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import Checkbox from '@frakt/components/Checkbox';
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
  RepayCell,
  CollectionInfoCell,
  HeaderRepayCell,
  RefinanceCell,
  HeaderRefinanceCell,
} from './LoansTableCells';

import styles from './LoansTable.module.scss';

export type SortColumns = {
  column: ColumnType<Loan>;
  order: SortOrder;
  isCardView: boolean;
}[];

export const getTableColumns = ({ isCardView, onSelectAll, duration }) => {
  const { selection, findLoanInSelection, toggleLoanInSelection } =
    useSelectedLoans();

  const NAME_COLUMN: ColumnType<Loan> = {
    title: (column) => (
      <div className={styles.headerTitleRow}>
        <Checkbox
          className={styles.checkbox}
          classNameInnerContent={styles.checkboxHeaderInnerContent}
          onChange={onSelectAll}
          checked={!!selection?.length}
        />
        <HeaderCell
          column={column}
          label="Collateral"
          value="collateral"
          hiddenSort
        />
      </div>
    ),
    render: (_, loan) => (
      <CollectionInfoCell
        nftName={loan.nft.name}
        nftImage={loan.nft.imageUrl}
        selected={!!findLoanInSelection(loan.pubkey)}
        onChangeCheckbox={() => toggleLoanInSelection(loan)}
        isCardView={isCardView}
      />
    ),
  };

  const BORROWED_COLUMN: ColumnType<Loan> = {
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
    sorter: true,
    showSorterTooltip: false,
  };

  const DEBT_COLUMN: ColumnType<Loan> = {
    key: 'repayValue',
    dataIndex: 'repayValue',
    title: (column) => (
      <HeaderCell column={column} label="Debt" value="repayValue" hiddenSort />
    ),
    render: (_, { repayValue }) => createSolValueJSX(repayValue),
    sorter: true,
    showSorterTooltip: false,
  };

  const LIQUIDATION_PRICE_COLUMN: ColumnType<Loan> = {
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
    sorter: true,
    showSorterTooltip: false,
  };

  const INTEREST_COLUMN: ColumnType<Loan> = {
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
    sorter: true,
    showSorterTooltip: false,
  };

  const HEALTH_COLUMN: ColumnType<Loan> = {
    key: 'health',
    dataIndex: 'health',
    title: (column) => (
      <HeaderCell column={column} label="Health" value="health" hiddenSort />
    ),
    render: (_, { classicParams }) =>
      createHighlitedPercentValueJSX(classicParams?.priceBased?.health),

    sorter: true,
    showSorterTooltip: false,
  };

  const DURATION_COLUMN: ColumnType<Loan> = {
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
    sorter: true,
    showSorterTooltip: false,
  };

  const REPAY_COLUMN: ColumnType<Loan> & { united: boolean } = {
    title: () => !isCardView && <HeaderRepayCell />,
    render: (_, loan) => <RepayCell isCardView={isCardView} loan={loan} />,
    width: 130,
    united: true,
  };

  const REFINANCE_COLUMN: ColumnType<Loan> & { united: boolean } = {
    title: () => !isCardView && <HeaderRefinanceCell />,
    render: (_, loan) => <RefinanceCell isCardView={isCardView} loan={loan} />,
    width: 130,
    united: true,
  };

  const isPerpetual = duration === '0';

  return [
    NAME_COLUMN,
    BORROWED_COLUMN,
    DEBT_COLUMN,
    !isPerpetual ? DURATION_COLUMN : null,
    isPerpetual ? LIQUIDATION_PRICE_COLUMN : null,
    isPerpetual ? INTEREST_COLUMN : null,
    isPerpetual ? HEALTH_COLUMN : null,
    !isPerpetual ? REFINANCE_COLUMN : null,
    REPAY_COLUMN,
  ].filter(Boolean);
};
