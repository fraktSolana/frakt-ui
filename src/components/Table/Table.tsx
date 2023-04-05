import { Table as AntdTable } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DebouncedFunc } from 'lodash';
import classNames from 'classnames';

import { ActiveRowParams, PartialBreakpoints } from './types';
import { SortModalMobileProps } from './SortModalMobile';
import { Loader } from '../Loader';
import { Search } from './Search';

import styles from './Table.module.scss';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  noDataMessage?: string;
  className?: string;
  defaultField?: string;
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
}: TablePropsWithSortModalMobileProps<T>): JSX.Element => {
  if (loading) return <Loader />;

  return (
    <AntdTable
      className={classNames(className, {
        [styles.noDataTableMessage]: !data.length && !loading,
      })}
      rowClassName={(record) => {
        if (!activeRowParams?.field) return 'rowClassName';
        const field = record[activeRowParams?.field];
        const value = activeRowParams.value;

        if (!!field && !value) return activeRowParams?.className;
        return value && field === value && 'activeRowClassName';
      }}
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
