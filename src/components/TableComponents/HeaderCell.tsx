import { ColumnTitleProps } from 'antd/lib/table/interface';
import { QuestionCircleOutlined } from '@ant-design/icons';

import {
  ArrowDownTableSort,
  ArrowTableSort,
  ArrowUpTableSort,
} from '@frakt/icons';

import { SortOrders } from './types';
import Tooltip from '../Tooltip';

import styles from './TableComponents.module.scss';

interface HeaderCellProps<T> {
  column: ColumnTitleProps<T>;
  label: string;
  value: string;
  tooltipText?: string;
}

export const HeaderCell = <T extends unknown>({
  column,
  label,
  value,
  tooltipText,
}: HeaderCellProps<T>) => {
  const sortedColumn = column?.sortColumns?.find(
    ({ column }) => column.key === value,
  );

  const sortedOrder = sortedColumn?.order;

  return (
    <div className={styles.row}>
      <span className={styles.headerCellTitle}>{label}</span>
      {!!tooltipText && (
        <Tooltip placement="top" overlay={tooltipText}>
          <QuestionCircleOutlined className={styles.questionIcon} />
        </Tooltip>
      )}
      {sortedOrder === SortOrders.ASC && <ArrowUpTableSort />}
      {sortedOrder === SortOrders.DESC && <ArrowDownTableSort />}
      {sortedOrder !== SortOrders.DESC && sortedOrder !== SortOrders.ASC && (
        <ArrowTableSort />
      )}
    </div>
  );
};
