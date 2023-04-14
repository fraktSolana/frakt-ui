import { FC } from 'react';

import { useTableView } from '@frakt/components/Table/views/SortView';
import Table, {
  PartialBreakpoints,
  useSearch,
  useTable,
  Sort,
} from '@frakt/components/Table';
import { LoansHistory } from '@frakt/api/loans';

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
