import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Search } from '@frakt/components/Table/Search';
import { MarketPreview } from '@frakt/api/bonds';

import {
  TitleCell,
  HeaderTitleCell,
  createOfferTvlJSX,
  createBestOfferJSX,
  createDurationJSX,
  createAprJSX,
  createSolValueJSX,
  createHighestLtvJSX,
} from './TableCells';
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
      render: (_, market: MarketPreview) => <TitleCell market={market} />,
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
      sorter: (a, b) => parseFloat(a.offerTVL) - parseFloat(b.offerTVL),
      render: (value) => createOfferTvlJSX(value),
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
      sorter: (a, b) => a.bestOffer - b.bestOffer,
      render: (value) => createBestOfferJSX(value),
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
      render: (value) => createDurationJSX(value),
      showSorterTooltip: false,
    },
    {
      key: 'activeLoans',
      dataIndex: 'activeLoans',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Active loans"
          value="activeLoans"
        />
      ),
      render: (value) => createSolValueJSX(value),
      sorter: (a, b) => parseFloat(a.offerTVL) - parseFloat(b.offerTVL),
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
          tooltipText="Interest (in %) for the duration of this loan"
        />
      ),
      render: (value) => createHighestLtvJSX(value),
      sorter: (a, b) => a.bestLTV - b.bestLTV,
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
      sorter: (a, b) => parseFloat(a.offerTVL) - parseFloat(b.offerTVL),
      showSorterTooltip: false,
    },
  ];

  return COLUMNS;
};
