import { FC } from 'react';

import Table, { useTable, PartialBreakpoints } from '@frakt/components/Table';
import { useWindowSize } from '@frakt/hooks';

import { TableList } from './columns';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  loading?: boolean;
  className?: string;
  noDataClassName?: string;
  hideBond?: (bondPubkey: string) => void;
  haderTitleCellClassName?: string;
  breakpoints?: PartialBreakpoints;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  noDataClassName,
  loading,
  className,
  hideBond,
  haderTitleCellClassName,
  breakpoints,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= breakpoints?.mobile;

  const COLUMNS = TableList({
    data,
    isMobile,
    hideBond,
    className: haderTitleCellClassName,
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
