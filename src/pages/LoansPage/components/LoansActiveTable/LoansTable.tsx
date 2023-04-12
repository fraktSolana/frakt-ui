import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useTable, useSearch } from '@frakt/components/Table/hooks';
import { useTableView } from '@frakt/components/Table/views/SortView';
import Table, { PartialBreakpoints } from '@frakt/components/Table';
import { Loan } from '@frakt/api/loans';

import { useSelectedLoans } from '../../loansState';
import { TableList } from './columns';

export interface LoansActiveTableProps {
  data: ReadonlyArray<Loan>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
}

export const LoansActiveTable: FC<LoansActiveTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
}) => {
  const { toggleLoanInSelection } = useSelectedLoans();
  const { viewState } = useTableView();

  const history = useHistory();

  const onRowClick = useCallback(
    (dataItem: Loan) => {
      toggleLoanInSelection(dataItem);
    },
    [history],
  );

  const { filteredData, onChange } = useSearch({
    data,
    searchField: ['nft.name'],
  });

  const COLUMNS = TableList({ isCardView: viewState === 'card' });

  const { table } = useTable({
    data: filteredData,
    columns: COLUMNS,
    onRowClick,
    loading,
  });

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange }}
      className={className}
      viewParams={{
        showCard: viewState === 'card',
        showSorting: true,
      }}
      activeRowParams={{
        field: 'gracePeriod',
        className: 'graceRowClassName',
      }}
    />
  );
};
