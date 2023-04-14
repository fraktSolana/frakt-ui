import { ColumnsType } from 'antd/es/table';
import { DebouncedFunc } from 'lodash';

import {
  ActiveRowParams,
  ViewParams,
  PartialBreakpoints,
  SelectLoansParams,
} from './types';
import { Loader } from '../Loader';

import { SortDropdownProps } from './components/SortDropdown';
import { TableView, CardView, SortView } from './views';
import { Search } from './components/Search';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;

  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  className?: string;
  defaultField?: string;
  search?: {
    placeHolderText?: string;
    onChange: DebouncedFunc<(event: any) => void>;
  };
  breakpoints?: PartialBreakpoints;
  activeRowParams?: ActiveRowParams;
  viewParams?: ViewParams;
  selectLoansParams?: SelectLoansParams;
  cardClassName?: string;
}

export interface TablePropsWithSortProps<T>
  extends TableProps<T>,
    SortDropdownProps<T> {}

const Table = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  loading = false,
  className,
  breakpoints,
  activeRowParams,
  sort,
  setSort,
  search,
  viewParams,
  selectLoansParams,
  setQueryData,
  cardClassName,
}: TablePropsWithSortProps<T>): JSX.Element => {
  if (loading) return <Loader />;

  return (
    <>
      {viewParams?.showSorting && (
        <SortView
          search={search}
          sort={sort}
          setSort={setSort}
          columns={columns}
          selectLoansParams={selectLoansParams}
          setQueryData={setQueryData}
        />
      )}
      {viewParams?.showCard ? (
        <CardView
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          rowKeyField={rowKeyField}
          className={cardClassName}
          activeRowParams={activeRowParams}
        />
      ) : (
        <TableView
          data={data}
          className={className}
          breakpoints={breakpoints}
          activeRowParams={activeRowParams}
          loading={loading}
          columns={columns}
          rowKeyField={rowKeyField}
          onRowClick={onRowClick}
        />
      )}
    </>
  );
};

Table.Search = Search;

export { Table };
