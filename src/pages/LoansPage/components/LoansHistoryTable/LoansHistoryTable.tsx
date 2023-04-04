import { FC } from 'react';

import Table, { PartialBreakpoints, useTable } from '@frakt/components/Table';

import { COLUMNS } from './columns';

export interface LoansHistoryTableProps {
  data: ReadonlyArray<any>;
  loading: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
}

export const LoansHistoryTable: FC<LoansHistoryTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
}) => {
  const { table } = useTable({
    data,
    columns: COLUMNS,
    loading,
  });

  return <Table {...table} breakpoints={breakpoints} className={className} />;
};
