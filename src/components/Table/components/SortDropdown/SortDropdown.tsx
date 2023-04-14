import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

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
}

export const SortDropdown = <T extends unknown>({
  visible,
  sort,
  setSort,
  columns,
  setQueryData,
}: SortDropdownProps<T>): JSX.Element => {
  const onChangeSort = ({ field, direction }: Sort) => {
    if (setQueryData) {
      setQueryData({ field, direction });
    }
    setSort({ field, direction });
  };

  return (
    <DropdownBackdrop visible={visible}>
      {columns
        .filter(({ sorter }) => !!sorter)
        .map((column) => {
          const { order, field, lable } = parseTableColumn(column);

          const activeAscSortButton =
            field === sort.field && sort.direction === 'asc';

          const activeDescSortButton =
            (field === sort.field && sort.direction === 'desc') ||
            (order && !sort.field);

          return (
            <div className={styles.sortWrapper} key={field}>
              <div className={styles.sortDirectionsButtons}>
                <Button
                  type="tertiary"
                  onClick={() => onChangeSort({ field, direction: 'asc' })}
                  className={classNames(styles.sortButton, {
                    [styles.active]: activeAscSortButton,
                  })}
                >
                  {lable}
                  <ArrowUp />
                </Button>
                <Button
                  type="tertiary"
                  onClick={() => onChangeSort({ field, direction: 'desc' })}
                  className={classNames(styles.sortButton, {
                    [styles.active]: activeDescSortButton,
                  })}
                >
                  {lable}
                  <ArrowUp className={styles.arrowDown} />
                </Button>
              </div>
            </div>
          );
        })}
    </DropdownBackdrop>
  );
};

const parseTableColumn = (column) => {
  const { key, title, defaultSortOrder } = column;

  const keyString = String(key);
  const lable = title?.(null)?.props.label || title;

  return {
    order: defaultSortOrder,
    field: keyString,
    lable,
  };
};
