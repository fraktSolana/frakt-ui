import { FC } from 'react';

import Table, { PartialBreakpoints, Sort } from '@frakt/components/Table';
import { BorrowNft } from '@frakt/api/nft';
import {
  useTable,
  useSearch,
  useTableView,
} from '@frakt/components/Table/hooks';

import { TableList, TableListPerpetual } from './columns';
import { useBorrowManualLitePage } from '../../BorrowManualLitePage';

export interface BorrowManualTableProps {
  data: ReadonlyArray<BorrowNft>;
  loading?: boolean;
  className?: string;
  breakpoints?: PartialBreakpoints;
  duration: string;
  setQueryData: (nextValue: Sort) => void;
  setQuerySearch: (nextValue: string) => void;
}

export const BorrowManualTable: FC<BorrowManualTableProps> = ({
  data,
  className,
  loading,
  breakpoints,
  duration,
  setQueryData,
  setQuerySearch,
}) => {
  const { onNftClick } = useBorrowManualLitePage();

  const { viewState } = useTableView();

  const onRowClick = (nft: BorrowNft) => {
    onNftClick(nft);
  };

  const { filteredData, onChange } = useSearch({
    data,
    searchField: ['name'],
    setQuerySearch,
  });

  const COLUMNS = duration === '0' ? TableListPerpetual() : TableList();

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
      setQueryData={setQueryData}
      // activeRowParams={{
      //   className: styles.selected,
      // }}
    />
  );
};
