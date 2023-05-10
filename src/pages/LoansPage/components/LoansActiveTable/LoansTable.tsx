import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Table, { PartialBreakpoints } from '@frakt/components/Table';
import { Loan } from '@frakt/api/loans';
import {
  useTable,
  useSearch,
  useTableView,
} from '@frakt/components/Table/hooks';

import { useSelectedLoans } from '../../loansState';
import { TableList } from './columns';
import styles from './LoansTable.module.scss';

export interface LoansActiveTableProps {
  data: ReadonlyArray<Loan>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
  cardClassName?: string;
}

export const LoansActiveTable: FC<LoansActiveTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
  cardClassName,
}) => {
  const { toggleLoanInSelection } = useSelectedLoans();
  const { viewState } = useTableView();
  const { setSelection, selection, clearSelection } = useSelectedLoans();

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

  const onChangeCheckbox = (): void => {
    if (selection?.length) {
      clearSelection();
    } else {
      setSelection(filteredData as Loan[]);
    }
  };

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange }}
      className={className}
      cardClassName={cardClassName}
      viewParams={{
        showCard: viewState === 'card',
        showSorting: true,
        showSearching: true,
      }}
      selectLoansParams={{
        onChange: onChangeCheckbox,
        selected: !!selection?.length,
      }}
      activeRowParams={{
        field: 'gracePeriod',
        className: 'graceRowClassName',
        cardClassName: styles.graced,
      }}
    />
  );
};
