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
  createActiveLoansJSX,
  createBestOfferJSX,
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
  isMobile?: boolean;
}[];

export const TableList = ({ onChange, onRowClick, isMobile }) => {
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
      render: (_, market: MarketPreview) => (
        <TitleCell market={market} onRowClick={onRowClick} />
      ),
      width: isMobile ? 150 : 180,
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
      width: 120,
    },
    {
      key: 'bestLTV',
      dataIndex: 'bestLTV',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Best offer"
          value="bestLTV"
          tooltipText="Total liquidity currently available in active offers"
        />
      ),
      sorter: (a, b) => sortingFavoriteList(a, b, 'offerTVL', formateToNumbers),
      render: (value) => createBestOfferJSX(value),
      showSorterTooltip: false,
      width: 125,
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
      width: 110,
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
      width: 120,
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
      width: 72,
    },
  ];

  return COLUMNS;
};
