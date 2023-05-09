import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { BorrowNft } from '@frakt/api/nft';
import {
  createPercentValueJSX,
  createSolValueJSX,
  createValueJSX,
  HeaderCell,
} from '@frakt/components/TableComponents';

import { NftInfoCell } from './BorrowManualTableCells';
import { useBorrowManualLitePage } from '../../BorrowManualLitePage';

export type SortColumns = {
  column: ColumnType<BorrowNft>;
  order: SortOrder;
}[];

export const TableList = () => {
  const { findOrderInCart, currentNft } = useBorrowManualLitePage();

  const COLUMNS: ColumnsType<BorrowNft> = [
    {
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
      render: (_, { name, imageUrl, mint }) => (
        <NftInfoCell
          nftName={name}
          nftImage={imageUrl}
          selected={
            !!findOrderInCart({ nftMint: mint }) || currentNft?.mint === mint
          }
        />
      ),
      sorter: ({ name: nameA }, { name: nameB }) => nameB.localeCompare(nameA),
      showSorterTooltip: false,
    },
    {
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
      sorter: (
        { maxLoanValue: maxLoanValueA },
        { maxLoanValue: maxLoanValueB },
      ) => maxLoanValueA - maxLoanValueB,
      render: (_, nft) => createSolValueJSX(nft?.maxLoanValue),
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Interest"
          value="interest"
          hiddenSort
        />
      ),
      render: (_, nft) => createPercentValueJSX(13),
    },
    {
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
      render: (_, nft) =>
        createSolValueJSX(nft?.classicParams?.timeBased?.repayValue),
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
      render: (_, nft) =>
        createValueJSX(nft?.classicParams?.timeBased?.returnPeriodDays),
    },
  ];

  return COLUMNS;
};

export const TableListPerpetual = () => {
  const { findOrderInCart } = useBorrowManualLitePage();

  const COLUMNS: ColumnsType<BorrowNft> = [
    {
      title: (column) => (
        <HeaderCell
          fixedLeft
          column={column}
          label="Name"
          value="name"
          hiddenSort
        />
      ),
      render: (_, { name, imageUrl, mint }) => (
        <NftInfoCell
          nftName={name}
          nftImage={imageUrl}
          selected={!!findOrderInCart({ nftMint: mint })}
        />
      ),
      sorter: ({ name: nameA }, { name: nameB }) => nameB.localeCompare(nameA),
      showSorterTooltip: false,
    },
    {
      key: 'loanValue',
      dataIndex: 'loanValue',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Loan value"
          value="loanValue"
          hiddenSort
        />
      ),
      sorter: (
        { maxLoanValue: maxLoanValueA },
        { maxLoanValue: maxLoanValueB },
      ) => maxLoanValueA - maxLoanValueB,
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Yearly interest"
          value="interest"
          hiddenSort
        />
      ),
      render: (_, nft) => createPercentValueJSX(13),
      showSorterTooltip: false,
    },
    {
      key: 'fee',
      dataIndex: 'fee',
      title: (column) => (
        <HeaderCell
          column={column}
          label="Upfront fee"
          value="fee"
          hiddenSort
        />
      ),
      render: (_, nft) =>
        createSolValueJSX(nft?.classicParams?.timeBased?.repayValue),
    },
    {
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
      render: (_, nft) =>
        createValueJSX(nft?.classicParams?.timeBased?.returnPeriodDays),
    },
  ];

  return COLUMNS;
};
