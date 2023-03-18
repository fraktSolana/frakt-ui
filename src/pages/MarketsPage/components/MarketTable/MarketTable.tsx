import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Table, {
  PartialBreakpoints,
  useSearch,
  useTable,
} from '@frakt/components/Table';
import { MarketPreview } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';

import { TableList } from './columns';

export interface MarketTableProps {
  data: ReadonlyArray<any>;
  className?: string;
  loading?: boolean;
  breakpoints?: PartialBreakpoints;
}

export const MarketTable: FC<MarketTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
}) => {
  const history = useHistory();

  const onRowClick = useCallback(
    (dataItem: MarketPreview) => {
      history.push(`${PATHS.BOND}/${dataItem?.marketPubkey}`);
      window.scrollTo(0, 0);
    },
    [history],
  );

  const { filteredData, onChange } = useSearch({
    data,
    searchField: 'collectionName',
  });

  const COLUMNS = TableList({ onChange });

  const { table } = useTable({
    data: filteredData,
    columns: COLUMNS,
    onRowClick,
    loading,
    defaultField: 'offerTVL',
  });

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange }}
      className={className}
    />
  );
};
