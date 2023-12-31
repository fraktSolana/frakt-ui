import { ChangeEvent, FC } from 'react';
import { debounce } from 'lodash';

import Table, { PartialBreakpoints, SortParams } from '@frakt/components/Table';
import { useTable, useTableView } from '@frakt/components/Table/hooks';
import { SearchSelectProps } from '@frakt/components/SearchSelect';
import { BorrowNft, LoanDuration } from '@frakt/api/nft';

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
  setSearch: (nextValue: string) => void;
  onRowClick: (nft: BorrowNftData) => void;
  activeNftMint?: string;
  sortParams: SortParams;
  searchSelectParams: SearchSelectProps<any>;
}

export const BorrowManualTable: FC<BorrowManualTableProps> = ({
  data,
  loading,
  breakpoints,
  duration,
  setSearch,
  onRowClick,
  activeNftMint,
  sortParams,
  searchSelectParams,
}) => {
  const { viewState } = useTableView();

  const COLUMNS = getTableColumns({
    duration,
    isCardView: viewState === 'card',
  });

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
        showSearching: false,
      }}
      searchSelectParams={searchSelectParams}
      sortParams={sortParams}
      cardClassName={styles.cardClassName}
      activeRowParams={{
        className: styles.activeRowClassName,
        cardClassName: styles.activeCardClassName,
        field: 'nft.mint',
        value: activeNftMint,
      }}
    />
  );
};
