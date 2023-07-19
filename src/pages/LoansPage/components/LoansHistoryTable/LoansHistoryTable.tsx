import { FC } from 'react';

import { LoansHistory } from '@frakt/api/loans';
import Table, {
  PartialBreakpoints,
  SortParams,
  useSearch,
  useTable,
  useTableView,
} from '@frakt/components/Table';

import { COLUMNS } from './columns';

export interface LoansHistoryTableProps {
  data: ReadonlyArray<LoansHistory>;
  className?: string;
  breakpoints?: PartialBreakpoints;
  setQuerySearch: (nextValue: string) => void;
  sortParams: SortParams;
}

export const LoansHistoryTable: FC<LoansHistoryTableProps> = ({
  data,
  className,
  breakpoints,
  sortParams,
  setQuerySearch,
}) => {
  const { viewState } = useTableView();

  const { filteredData, onChange } = useSearch({
    data,
    searchField: 'nftName',
    setQuerySearch,
  });

  const { table } = useTable({ data: filteredData, columns: COLUMNS });

  return (
    <Table
      {...table}
      viewParams={{
        showCard: viewState === 'card',
        showSearching: true,
      }}
      breakpoints={breakpoints}
      search={{ onChange }}
      className={className}
      sortParams={sortParams}
    />
  );
};
