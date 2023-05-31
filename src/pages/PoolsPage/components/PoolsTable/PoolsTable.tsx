import { FC } from 'react';

import Table, { PartialBreakpoints } from '@frakt/components/Table';
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
  breakpoints?: PartialBreakpoints;
}

export const PoolsTable: FC<PoolsTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
}) => {
  const { viewState } = useTableView();
  const isCardView = viewState === 'card';

  const { filteredData, onChange: handleSearchChange } = useSearch({ data });

  const columns = getTableColumns(isCardView);
  const { table } = useTable({
    data: filteredData,
    filterField: ['userDeposit', 'depositAmount'],
    columns,
    defaultField: 'totalLiquidity',
    loading,
  });

  const viewParams = {
    showCard: isCardView,
    showSorting: true,
    showSearching: true,
    showToggle: true,
  };

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange: handleSearchChange }}
      className={className}
      viewParams={viewParams}
    />
  );
};
