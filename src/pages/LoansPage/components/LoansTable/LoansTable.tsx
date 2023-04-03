import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Table, {
  PartialBreakpoints,
  useSearch,
  useTable,
} from '@frakt/components/Table';

import { TableList } from './columns';
import { useSelectedLoans } from '../../loansState';
import { Loan } from '@frakt/api/loans';

export interface MarketTableProps {
  data: ReadonlyArray<any>;
  className?: string;
  loading?: boolean;
  breakpoints?: PartialBreakpoints;
}

export const LoansTable: FC<MarketTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
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
    searchField: 'collectionName',
  });

  const COLUMNS = TableList({ onChange });

  const { table } = useTable({
    data: filteredData,
    columns: COLUMNS,
    onRowClick,
    loading,
    defaultField: 'activeBondsAmount',
  });

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange }}
      className={className}
    />
  );
};
