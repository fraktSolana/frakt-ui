import { ChangeEvent, FC } from 'react';

import Table, { PartialBreakpoints } from '@frakt/components/Table';
import { BorrowNft, LoanDuration } from '@frakt/api/nft';
import { useTable, useTableView } from '@frakt/components/Table/hooks';

import { getTableColumns } from './columns';
import styles from './BorrowManualTable.module.scss';
import { debounce } from 'lodash';

export interface BorrowNftData {
  nft: BorrowNft;
  selected: boolean;
  active: boolean;
  bondLoanValue?: number;
  bondFee?: number;
}

export interface BorrowManualTableProps {
  data: ReadonlyArray<BorrowNftData>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
  duration: LoanDuration;
  setSearch: (nextValue: string) => void;
  onRowClick: (nft: BorrowNftData) => void;
  activeNftMint?: string;
}

export const BorrowManualTable: FC<BorrowManualTableProps> = ({
  data,
  loading,
  breakpoints,
  duration,
  setSearch,
  onRowClick,
  activeNftMint,
}) => {
  const { viewState } = useTableView();

  const COLUMNS = getTableColumns({ duration });

  const { table } = useTable({
    data,
    columns: COLUMNS,
    onRowClick,
    loading,
  });

  const debouncedSearch = debounce(
    (event: ChangeEvent<HTMLInputElement>) =>
      setSearch(event.target.value || ''),
    300,
  );

  return (
    <Table
      {...table}
      breakpoints={breakpoints}
      search={{ onChange: debouncedSearch }}
      className={styles.rootTable}
      viewParams={{
        showCard: viewState === 'card',
        showSorting: false,
        showSearching: true,
      }}
      activeRowParams={{
        className: styles.activeRowClassName,
        cardClassName: styles.activeCardClassName,
        field: 'nft.mint',
        value: activeNftMint,
      }}
    />
  );
};
