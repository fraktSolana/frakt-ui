import { ColumnsType, ColumnType } from 'antd/es/table';

import { LoanDuration } from '@frakt/api/nft';
import {
  createPercentValueJSX,
  createSolValueJSX,
  createValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import { NftInfoCell } from './BorrowManualTableCells';
import { BorrowNftData } from './BorrowManualTable';

type GetTableColumns = (props: {
  duration: LoanDuration;
}) => ColumnsType<BorrowNftData>;

export const getTableColumns: GetTableColumns = ({ duration }) => {
  const NAME_COLUMN: ColumnType<BorrowNftData> = {
    key: 'name',
    dataIndex: 'name',
    title: (column) => (
      <HeaderCell
        fixedLeft
        column={column}
        label="Name"
        value="name"
        hiddenSort
      />
    ),
    render: (_, { nft, selected }) => (
      <NftInfoCell
        nftName={nft.name}
        nftImage={nft.imageUrl}
        selected={selected}
      />
    ),
    sorter: ({ nft: nftA }, { nft: nftB }) =>
      nftB?.name?.localeCompare(nftA?.name),
    showSorterTooltip: false,
  };

  const LOAN_VALUE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'maxLoanValue',
    dataIndex: 'maxLoanValue',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Loan value"
        value="maxLoanValue"
        hiddenSort
      />
    ),
    sorter: ({ loanValue: loanValueA }, { loanValue: loanValueB }) =>
      loanValueB - loanValueA,
    render: (_, { loanValue }) => createSolValueJSX(loanValue),
    showSorterTooltip: false,
  };

  const INTEREST_COLUMN: ColumnType<BorrowNftData> = {
    key: 'interest',
    dataIndex: 'fee',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Interest"
        value="interest"
        hiddenSort
      />
    ),
    render: (_, { fee }) => createSolValueJSX(fee),
  };

  const REPAY_VALUE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'repayValue',
    dataIndex: 'repayValue',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Repay value"
        value="repayValue"
        hiddenSort
      />
    ),
    render: (_, { loanValue, fee }) => createSolValueJSX(loanValue + fee),
  };

  const DURATION_COLUMN: ColumnType<BorrowNftData> = {
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
    render: () => createValueJSX(`${duration} days`),
  };

  const YEARLY_INTEREST_COLUMN: ColumnType<BorrowNftData> = {
    key: 'yearlyInterest',
    dataIndex: 'yearlyInterest',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Yearly interest"
        value="interest"
        hiddenSort
      />
    ),
    render: (_, { yearlyInterest }) => createPercentValueJSX(yearlyInterest),
  };

  const UPFRONT_FEE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'fee',
    dataIndex: 'fee',
    title: (column) => (
      <HeaderCell column={column} label="Upfront fee" value="fee" hiddenSort />
    ),
    render: (_, { fee }) => createSolValueJSX(fee),
  };

  const LIQUIDATION_PRICE_COLUMN: ColumnType<BorrowNftData> = {
    key: 'liquidationPrice',
    dataIndex: 'liquidationPrice',
    title: (column) => (
      <HeaderCell
        column={column}
        label="Liquidation Price"
        value="liquidationPrice"
        hiddenSort
      />
    ),
    render: (_, { liquidationPrice }) => createSolValueJSX(liquidationPrice),
  };

  const isPerpetual = duration === '0';
  return [
    NAME_COLUMN,
    LOAN_VALUE_COLUMN,
    !isPerpetual ? INTEREST_COLUMN : null,
    !isPerpetual ? REPAY_VALUE_COLUMN : null,
    !isPerpetual ? DURATION_COLUMN : null,
    isPerpetual ? YEARLY_INTEREST_COLUMN : null,
    isPerpetual ? UPFRONT_FEE_COLUMN : null,
    isPerpetual ? LIQUIDATION_PRICE_COLUMN : null,
  ].filter(Boolean);
};