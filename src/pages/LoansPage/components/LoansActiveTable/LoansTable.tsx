import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Loan } from '@frakt/api/loans';
import Table, { PartialBreakpoints } from '@frakt/components/Table';

import { useSelectedLoans } from '../../loansState';
import { TableList } from './columns';
import { useTable, useSearch } from '@frakt/components/Table/hooks';

export interface LoansActiveTableProps {
  data: ReadonlyArray<Loan>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
  isCardView: boolean;
}

export const LoansActiveTable: FC<LoansActiveTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
  isCardView,
}) => {
  const { toggleLoanInSelection } = useSelectedLoans();

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

  const COLUMNS = TableList({ isCardView });

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
        showCard: isCardView,
        showSorting: true,
      }}
      activeRowParams={{
        field: 'gracePeriod',
        className: 'graceRowClassName',
      }}
    />
  );
};
