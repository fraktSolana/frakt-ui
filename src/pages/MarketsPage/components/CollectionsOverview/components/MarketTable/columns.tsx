import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Search } from '@frakt/components/Table/Search';
import { MarketPreview } from '@frakt/api/bonds';

import {
  TitleCell,
  HeaderTitleCell,
  createOfferTvlJSX,
  createDurationJSX,
  createAprJSX,
  createHighestLtvJSX,
  createActiveLoansJSX,
} from './TableCells';
import {
  formateDuration,
  formateToNumbers,
  sortingFavoriteList,
} from './helpers';
import styles from './TableCells/TableCells.module.scss';

export type SortColumns = {
  column: ColumnType<MarketPreview>;
  order: SortOrder;
}[];

export const TableList = ({ onChange }) => {
  const COLUMNS: ColumnsType<MarketPreview> = [
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
      fixed: 'left',
      render: (_, market: MarketPreview) => <TitleCell market={market} />,
    },
    {
      key: 'activeBondsAmount',
      dataIndex: 'activeBondsAmount',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Active loans"
          value="activeBondsAmount"
        />
      ),
      render: (value) => createActiveLoansJSX(value),
      sorter: (a, b) => sortingFavoriteList(a, b, 'activeBondsAmount'),
      showSorterTooltip: false,
      defaultSortOrder: 'descend',
    },
    {
      key: 'offerTVL',
      dataIndex: 'offerTVL',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Offer TVL"
          value="offerTVL"
          tooltipText="Total liquidity currently available in active offers"
        />
      ),
      sorter: (a, b) => sortingFavoriteList(a, b, 'offerTVL', formateToNumbers),
      render: (value) => createOfferTvlJSX(value),
      showSorterTooltip: false,
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Duration"
          value="duration"
        />
      ),
      sorter: (a, b) => sortingFavoriteList(a, b, 'duration', formateDuration),
      render: (value) => createDurationJSX(value),
      showSorterTooltip: false,
    },
    {
      key: 'bestLTV',
      dataIndex: 'bestLTV',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Highest LTV"
          value="bestLTV"
          tooltipText="Highest loan amount offered for that collection"
        />
      ),
      render: (value) => createHighestLtvJSX(value),
      sorter: (a, b) => sortingFavoriteList(a, b, 'bestLTV'),
      showSorterTooltip: false,
    },
    {
      key: 'apy',
      dataIndex: 'apy',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="APR"
          value="apy"
          tooltipText="Interest (in %) for the duration of this loan"
        />
      ),
      render: (value) => createAprJSX(value),
      sorter: (a, b) => sortingFavoriteList(a, b, 'apy'),
      showSorterTooltip: false,
    },
  ];

  return COLUMNS;
};
