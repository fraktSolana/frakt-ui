import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { MarketPreview } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';
import Table, {
  PartialBreakpoints,
  useSearch,
  useTable,
} from '@frakt/components/Table';

import { TableList } from './columns';

export interface MarketTableProps {
  data: ReadonlyArray<any>;
  className?: string;
  loading?: boolean;
  breakpoints?: PartialBreakpoints;
  marketPubkey: string;
}

export const MarketTable: FC<MarketTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
  marketPubkey,
}) => {
  const history = useHistory();

  const onRowClick = useCallback(
    (dataItem: MarketPreview) => {
      if (marketPubkey === dataItem?.marketPubkey) {
        history.push(PATHS.BONDS);
      } else {
        history.push(`${PATHS.BONDS}/${dataItem?.marketPubkey}`);
      }
    },
    [history, marketPubkey],
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
      activeRowParams={{
        field: 'marketPubkey',
        value: marketPubkey,
      }}
    />
  );
};
