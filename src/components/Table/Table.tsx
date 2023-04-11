import { Table as AntdTable } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DebouncedFunc } from 'lodash';
import classNames from 'classnames';

import { ActiveRowParams, PartialBreakpoints } from './types';
import { SortModalMobile, SortModalMobileProps } from './SortModalMobile';
import { getRowClassName } from './helpers';
import { Loader } from '../Loader';
import { Search } from './Search';

import styles from './Table.module.scss';
import { useFiltersModal } from '../FiltersDropdown';
import { useOnClickOutside } from '@frakt/hooks';
import { useRef } from 'react';
import Button from '../Button';
import { MobileTable } from './MobileTable';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  noDataMessage?: string;
  className?: string;
  defaultField?: string;
  isCardView?: boolean;
  search?: {
    placeHolderText?: string;
    onChange: DebouncedFunc<(event: any) => void>;
  };
  breakpoints?: PartialBreakpoints;
  activeRowParams?: ActiveRowParams;
}

export interface TablePropsWithSortModalMobileProps<T>
  extends TableProps<T>,
    SortModalMobileProps<T> {}

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
  isCardView,
}: TablePropsWithSortModalMobileProps<T>): JSX.Element => {
  const {
    visible: sortModalMobileVisible,
    close: closeModalMobile,
    toggle: toggleModalMobile,
  } = useFiltersModal();

  const ref = useRef(null);
  useOnClickOutside(ref, closeModalMobile);

  if (loading) return <Loader />;

  if (isCardView) {
    return (
      <>
        <div className={isCardView && styles.sortWrapper}>
          <Search
            onChange={search?.onChange}
            className={styles.searchInput}
            placeHolderText={search?.placeHolderText}
          />
          <div ref={ref}>
            <Button type="tertiary" onClick={toggleModalMobile}>
              Sorting
            </Button>
            <SortModalMobile
              columns={columns}
              setSort={setSort}
              sort={sort}
              sortModalMobileVisible={sortModalMobileVisible}
            />
          </div>
        </div>
        <MobileTable
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          rowKeyField={rowKeyField}
        />
      </>
    );
  }

  return (
    <AntdTable
      className={classNames(className, {
        [styles.noDataTableMessage]: !data.length && !loading,
      })}
      rowClassName={(record) => getRowClassName(record, activeRowParams)}
      columns={columns as ColumnsType}
      dataSource={data as any}
      pagination={false}
      sortDirections={['descend', 'ascend']}
      style={onRowClick && { cursor: 'pointer' }}
      rowKey={(data) => data[rowKeyField]}
      scroll={{ x: breakpoints?.scrollX, y: breakpoints?.scrollY }}
      onRow={
        onRowClick
          ? (data) => ({
              onClick: () => onRowClick(data as T),
            })
          : null
      }
    />
  );
};

Table.Search = Search;

export { Table };
