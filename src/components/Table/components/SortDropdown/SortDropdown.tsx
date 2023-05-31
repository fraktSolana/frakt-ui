import { ColumnType, ColumnsType } from 'antd/es/table';
import { filter, isEqual, map } from 'lodash';
import classNames from 'classnames';

import Toggle from '@frakt/components/Toggle/Toggle';
import Button from '@frakt/components/Button';
import { ArrowUp } from '@frakt/icons';

import { DropdownBackdrop } from '../DropdownBackdrop';
import { Sort } from '../../types';

import styles from './SortDropdown.module.scss';

export interface SortDropdownProps<T> {
  visible?: boolean;
  sort: Sort;
  setSort: (nextSort: Sort) => void;
  columns: ColumnsType<T>;
  setQueryData?: (nextSort: Sort) => void;
  isToggleChecked?: boolean;
  setIsToggleChecked?: (value: boolean) => void;
  showToggle?: boolean;
}

export const SortDropdown = <T extends unknown>({
  visible,
  sort,
  setSort,
  columns,
  setQueryData,
  isToggleChecked,
  setIsToggleChecked,
  showToggle,
}: SortDropdownProps<T>): JSX.Element => {
  const onChangeSort = ({ field, direction }: Sort) => {
    if (setQueryData) {
      setQueryData({ field, direction });
    }
    setSort({ field, direction });
  };

  const renderSortButton = (column: ColumnType<any>) => {
    const { field, label } = parseTableColumn(column);

    const sortAsc = { field, direction: 'asc' } as Sort;
    const sortDesc = { field, direction: 'desc' } as Sort;

    const isActiveAscSortButton = isEqual(sort, sortAsc);
    const isActiveDescSortButton =
      isEqual(sort, sortDesc) || (column.defaultSortOrder && !sort.field);

    return (
      <div className={styles.sortWrapper} key={field}>
        <div className={styles.sortDirectionsButtons}>
          <Button
            type="tertiary"
            onClick={() => onChangeSort(sortAsc)}
            className={classNames(styles.sortButton, {
              [styles.active]: isActiveAscSortButton,
            })}
          >
            {label}
            <ArrowUp className={styles.arrow} />
          </Button>
          <Button
            type="tertiary"
            onClick={() => onChangeSort(sortDesc)}
            className={classNames(styles.sortButton, {
              [styles.active]: isActiveDescSortButton,
            })}
          >
            {label}
            <ArrowUp className={styles.arrowDown} />
          </Button>
        </div>
      </div>
    );
  };

  const renderTooltip = () => {
    if (!showToggle) return null;
    return (
      <Toggle
        label="Staked only"
        onChange={() => setIsToggleChecked(!isToggleChecked)}
        value={isToggleChecked}
      />
    );
  };

  const renderSortDropdown = () => {
    const sortableColumns = filter(columns, ({ sorter }) => !!sorter);
    return map(sortableColumns, renderSortButton);
  };

  return (
    <DropdownBackdrop visible={visible}>
      {renderTooltip()}
      {renderSortDropdown()}
    </DropdownBackdrop>
  );
};

const parseTableColumn = (column) => {
  const { key, title } = column;

  const field = String(key);
  const label = title?.(null)?.props.label || title;

  return { field, label };
};
