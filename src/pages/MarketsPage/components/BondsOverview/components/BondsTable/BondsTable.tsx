import { FC } from 'react';

import Table, { useTable, PartialBreakpoints } from '@frakt/components/Table';

import { TableList } from './columns';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  loading?: boolean;
  className?: string;
  hideBond?: (bondPubkey: string) => void;
  breakpoints?: PartialBreakpoints;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  loading,
  className,
  hideBond,
  breakpoints,
}) => {
  const COLUMNS = TableList({
    data,
    hideBond,
  });

  const { table, search } = useTable({
    data,
    columns: COLUMNS,
    loading,
  });

  return (
    <Table
      {...table}
      search={search}
      className={className}
      breakpoints={breakpoints}
    />
  );
};
