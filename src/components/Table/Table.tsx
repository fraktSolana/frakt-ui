import { ChangeEvent, ReactNode } from 'react';
import { ColumnsType } from 'antd/es/table';
import { DebouncedFunc, isEmpty } from 'lodash';

import { TableView, CardView, SortView } from './views';
import { SearchSelectProps } from '../SearchSelect';
import { Search } from './components/Search';
import { Loader } from '../Loader';
import {
  ActiveRowParams,
  ViewParams,
  PartialBreakpoints,
  SortParams,
  ToggleParams,
  TablePropsWithSortProps,
} from './types';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;

  cardViewTableContent?: ReactNode;

  loading?: boolean;
  rowKeyField?: string;
  onRowClick?: (dataItem: T) => void;
  defaultField?: string;
  filterField?: string | string[];
  search?: {
    placeHolderText?: string;
    onChange: DebouncedFunc<(event: ChangeEvent<HTMLInputElement>) => void>;
  };

  breakpoints?: PartialBreakpoints;
  activeRowParams?: ActiveRowParams;
  viewParams?: ViewParams;
  sortParams?: SortParams;
  searchSelectParams?: SearchSelectProps<T>;
  toggleParams?: ToggleParams;

  className?: string;
  cardClassName?: string;
  classNameSortView?: string;
}

const Table = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  loading = false,
  className,
  breakpoints,
  activeRowParams,
  sortParams,
  viewParams,
  cardClassName,
  searchSelectParams,
  toggleParams,
  search,
  cardViewTableContent,
  classNameSortView,
}: TablePropsWithSortProps<T>): JSX.Element => {
  if (loading) return <Loader />;

  const showSearching = viewParams?.showSearching;
  const showCard = viewParams?.showCard;
  const showSearchSelect = !isEmpty(searchSelectParams);

  const SortViewComponent = showSearching || showSearchSelect ? SortView : null;
  const ViewComponent = showCard ? CardView : TableView;

  return (
    <>
      {SortViewComponent && (
        <SortViewComponent
          sortParams={sortParams}
          columns={columns}
          search={search}
          toggleParams={toggleParams}
          showSearching={showSearching}
          searchSelectParams={searchSelectParams}
          classNameSortView={classNameSortView}
        />
      )}
      {showCard && cardViewTableContent}
      {ViewComponent && (
        <ViewComponent
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          rowKeyField={rowKeyField}
          className={showCard ? cardClassName : className}
          activeRowParams={activeRowParams}
          breakpoints={breakpoints}
          loading={loading}
        />
      )}
    </>
  );
};

Table.Search = Search;

export { Table };
