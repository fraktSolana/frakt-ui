import { FC } from 'react';

import Table, {
  PartialBreakpoints,
  SortParams,
  ToggleParams,
} from '@frakt/components/Table';
import { LiquidityPool } from '@frakt/api/pools';

import {
  useTable,
  useSearch,
  useTableView,
} from '@frakt/components/Table/hooks';

import { getTableColumns } from './columns';

export interface PoolsTableProps {
  data: ReadonlyArray<LiquidityPool>;
  loading?: boolean;
  className?: string;
  classNameSortView?: string;
  breakpoints?: PartialBreakpoints;
  sortParams: SortParams;
  toggleParams: ToggleParams;
}

export const PoolsTable: FC<PoolsTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
  sortParams,
  toggleParams,
  classNameSortView,
}) => {
  const { viewState } = useTableView();
  const isCardView = viewState === 'card';

  const { filteredData, onChange: handleSearchChange } = useSearch({ data });

  const columns = getTableColumns(isCardView);
  const { table } = useTable({
    data: filteredData,
    columns,
    loading,
  });

  const viewParams = {
    showCard: isCardView,
    showSearching: true,
  };

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange: handleSearchChange }}
      className={className}
      classNameSortView={classNameSortView}
      viewParams={viewParams}
      sortParams={sortParams}
      toggleParams={toggleParams}
    />
  );
};
