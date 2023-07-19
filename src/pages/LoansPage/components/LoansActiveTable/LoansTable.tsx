import { FC, ReactNode, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Table, { PartialBreakpoints, SortParams } from '@frakt/components/Table';
import { SearchSelectProps } from '@frakt/components/SearchSelect';
import { Loan } from '@frakt/api/loans';
import {
  useTable,
  useSearch,
  useTableView,
} from '@frakt/components/Table/hooks';

import { useSelectedLoans } from '../../loansState';
import { getTableColumns } from './columns';

import styles from './LoansTable.module.scss';

export interface LoansActiveTableProps {
  data: ReadonlyArray<Loan>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
  searchSelectParams: SearchSelectProps<any>;
  cardClassName?: string;
  sortParams: SortParams;
  duration: string;
  cardViewTableContent: ReactNode;
}

export const LoansActiveTable: FC<LoansActiveTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
  cardClassName,
  sortParams,
  duration,
  searchSelectParams,
  cardViewTableContent,
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
    searchField: ['nft', 'name'],
  });

  const onSelectAll = (): void => {
    if (selection?.length) {
      clearSelection();
    } else {
      setSelection(filteredData as Loan[]);
    }
  };

  const COLUMNS = getTableColumns({
    isCardView: viewState === 'card',
    onSelectAll,
    duration,
  });

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
      sortParams={sortParams}
      className={className}
      cardClassName={cardClassName}
      searchSelectParams={searchSelectParams}
      cardViewTableContent={cardViewTableContent}
      viewParams={{
        showCard: viewState === 'card',
        showSearching: false,
      }}
      activeRowParams={{
        field: 'isGracePeriod',
        value: true,
        className: 'graceRowClassName',
        cardClassName: styles.graced,
      }}
    />
  );
};
