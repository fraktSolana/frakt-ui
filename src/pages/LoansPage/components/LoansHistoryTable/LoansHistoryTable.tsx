import { FC } from 'react';

import { LoansHistory } from '@frakt/api/loans';
import Table, {
  PartialBreakpoints,
  useSearch,
  useTable,
  Sort,
  useTableView,
} from '@frakt/components/Table';

import { COLUMNS } from './columns';

export interface LoansHistoryTableProps {
  data: ReadonlyArray<LoansHistory>;
  className?: string;
  breakpoints?: PartialBreakpoints;
  setQueryData: (nextValue: Sort) => void;
}

export const LoansHistoryTable: FC<LoansHistoryTableProps> = ({
  data,
  className,
  breakpoints,
  setQueryData,
}) => {
  const { viewState } = useTableView();

  const { filteredData, onChange } = useSearch({
    data,
    searchField: ['nft.name'],
  });

  const { table } = useTable({ data: filteredData, columns: COLUMNS });

  return (
    <Table
      {...table}
      viewParams={{ showCard: viewState === 'card', showSorting: true }}
      breakpoints={breakpoints}
      search={{ onChange }}
      className={className}
      setQueryData={setQueryData}
    />
  );
};
