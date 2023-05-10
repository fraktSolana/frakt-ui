import { FC } from 'react';

import Table, { PartialBreakpoints, Sort } from '@frakt/components/Table';
import { BorrowNft, LoanDuration } from '@frakt/api/nft';
import {
  useTable,
  useSearch,
  useTableView,
} from '@frakt/components/Table/hooks';

import { getTableColumns } from './columns';
import styles from './BorrowManualTable.module.scss';

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
  setQueryData: (nextValue: Sort) => void;
  setQuerySearch: (nextValue: string) => void;
  onRowClick: (nft: BorrowNftData) => void;
  activeNftMint?: string;
}

export const BorrowManualTable: FC<BorrowManualTableProps> = ({
  data,
  loading,
  breakpoints,
  duration,
  setQueryData,
  setQuerySearch,
  onRowClick,
}) => {
  const { viewState } = useTableView();

  const { filteredData, onChange } = useSearch({
    data,
    searchField: ['name'],
    setQuerySearch,
  });

  const COLUMNS = getTableColumns({ duration });

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
      className={styles.rootTable}
      viewParams={{
        showCard: viewState === 'card',
        showSorting: false,
        showSearching: true,
      }}
      setQueryData={setQueryData}
    />
  );
};
