import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Search } from '@frakt/components/Table/components/Search';
import { MarketPreview } from '@frakt/api/bonds';

import {
  TitleCell,
  HeaderTitleCell,
  createOfferTvlJSX,
  createDurationJSX,
  createApyJSX,
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
      render: (_, market) => <TitleCell market={market} />,
    },
    {
      key: 'loansTVL',
      dataIndex: 'loansTVL',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Loans TVL"
          value="loansTVL"
        />
      ),
      render: (_, market) => createActiveLoansJSX(market),
      sorter: (a, b) => sortingFavoriteList(a, b, 'loansTVL'),
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
      render: (_, market) => createOfferTvlJSX(market),
      showSorterTooltip: false,
    },
    {
      key: 'bestOffer',
      dataIndex: 'bestOffer',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Best offer"
          value="bestOffer"
          tooltipText="Total liquidity currently available in active offers"
        />
      ),
      sorter: (a, b) =>
        sortingFavoriteList(a, b, 'bestOffer', formateToNumbers),
      render: (_, market) => createBestOfferJSX(market),
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
      key: 'apy',
      dataIndex: 'apy',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="APY"
          value="apy"
          tooltipText="Interest (in %) for the duration of this loan"
        />
      ),
      render: (value) => createApyJSX(value),
      sorter: (a, b) => sortingFavoriteList(a, b, 'apy'),
      showSorterTooltip: false,
    },
  ];

  return COLUMNS;
};
