import { FC, useEffect } from 'react';
import classNames from 'classnames';

import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '@frakt/components/Tooltip';
import {
  ArrowDownTableSort,
  ArrowTableSort,
  ArrowUpTableSort,
} from '@frakt/icons';

import { useHistoryBondsSort } from '../../HistoryTab/hooks';
import { SortColumns } from '../columns';

import styles from './TableCells.module.scss';

interface HeaderCellProps {
  sortColumns?: SortColumns;
  label: string;
  value: string;
  tooltipText?: string;
  fixedLeft?: boolean;
  removeSort?: boolean;
}

export const HeaderCell: FC<HeaderCellProps> = ({
  sortColumns,
  label,
  value,
  tooltipText,
  fixedLeft,
  removeSort,
}) => {
  const { setSortQuery } = useHistoryBondsSort();
  const sortedColumn = sortColumns?.find(({ column }) => column.key === value);

  useEffect(() => {
    if (sortedColumn) {
      setSortQuery(sortedColumn);
    }
  }, [sortedColumn]);

  return (
    <div className={classNames(styles.row, fixedLeft && styles.fixedLeftRow)}>
      <span className={styles.title}>{label}</span>
      {!!tooltipText && <Tooltip placement="top" overlay={tooltipText} />}
      {!removeSort && (
        <span className={styles.sortIcon}>
          {sortedColumn?.order === 'ascend' && <ArrowUpTableSort />}
          {sortedColumn?.order === 'descend' && <ArrowDownTableSort />}
          {sortedColumn?.order !== 'descend' &&
            sortedColumn?.order !== 'ascend' && <ArrowTableSort />}
        </span>
      )}
    </div>
  );
};
