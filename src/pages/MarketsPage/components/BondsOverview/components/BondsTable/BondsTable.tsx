import { FC } from 'react';

import Table, { useTable, PartialBreakpoints } from '@frakt/components/Table';

import { TableList } from './columns';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  loading?: boolean;
  className?: string;
  noDataClassName?: string;
  hideBond?: (bondPubkey: string) => void;
  breakpoints?: PartialBreakpoints;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  noDataClassName,
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
    searchParams: {
      searchField: ['collateralBox.nft.name'],
      debounceWait: 300,
    },
    loading,
  });

  return (
    <Table
      {...table}
      search={search}
      className={className}
      noDataClassName={noDataClassName}
      breakpoints={breakpoints}
    />
  );
};
