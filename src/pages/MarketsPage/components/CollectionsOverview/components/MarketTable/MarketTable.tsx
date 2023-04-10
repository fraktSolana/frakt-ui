import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { MarketPreview } from '@frakt/api/bonds';
import { useWindowSize } from '@frakt/hooks';
import { PATHS, TABLET_SIZE } from '@frakt/constants';
import Table, {
  PartialBreakpoints,
  useSearch,
  useTable,
} from '@frakt/components/Table';

import { useChartVisible } from '../Chart';
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
  const { setVisibility } = useChartVisible();
  const { width } = useWindowSize();
  const isMobile = width <= TABLET_SIZE;

  const onRowClick = useCallback(
    (dataItem: MarketPreview) => {
      if (marketPubkey === dataItem?.marketPubkey) {
        history.push(PATHS.BONDS);
      } else {
        setVisibility(true);
        history.push(`${PATHS.BONDS}/${dataItem?.marketPubkey}`);
      }
    },
    [history, marketPubkey],
  );

  const { filteredData, onChange } = useSearch({
    data,
    searchField: 'collectionName',
  });

  const COLUMNS = TableList({
    onChange,
    isMobile,
  });

  const { table } = useTable({
    data: filteredData,
    columns: COLUMNS,
    onRowClick,
    loading,
    defaultField: 'activeBondsAmount',
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
