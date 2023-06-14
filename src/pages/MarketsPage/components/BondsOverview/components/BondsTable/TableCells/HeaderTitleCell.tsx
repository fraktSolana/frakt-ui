import { FC, useEffect } from 'react';
import classNames from 'classnames';

import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '@frakt/components/Tooltip';
import {
  ArrowDownTableSort,
  ArrowTableSort,
  ArrowUpTableSort,
} from '@frakt/icons';

import { useBondsSort } from '../../BondsTab/hooks';
import { SortColumns } from '../columns';

import styles from './TableCells.module.scss';

interface HeaderTitleCellProps {
  sortColumns?: SortColumns;
  label: string;
  value: string;
  tooltipText?: string;
  fixedLeft?: boolean;
}

export const HeaderTitleCell: FC<HeaderTitleCellProps> = ({
  sortColumns,
  label,
  value,
  tooltipText,
  fixedLeft,
}) => {
  const { setSortQuery } = useBondsSort();
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
      <span className={styles.sortIcon}>
        {sortedColumn?.order === 'ascend' && <ArrowUpTableSort />}
        {sortedColumn?.order === 'descend' && <ArrowDownTableSort />}
        {sortedColumn?.order !== 'descend' &&
          sortedColumn?.order !== 'ascend' && <ArrowTableSort />}
      </span>
    </div>
  );
};
