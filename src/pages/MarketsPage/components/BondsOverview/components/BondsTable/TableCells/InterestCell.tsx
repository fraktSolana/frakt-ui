import { FC } from 'react';
import classNames from 'classnames';

import styles from './TableCells.module.scss';

interface InterestCellProps {
  interest: number;
  apy: number;
}

export const InterestCell: FC<InterestCellProps> = ({ interest, apy }) => (
  <div className={styles.column}>
    <span className={styles.value}> {(interest / 100 || 0).toFixed(0)}%</span>
    <span className={classNames(styles.value, styles.valueSmall)}>
      {apy?.toFixed(0)}% APR
    </span>
  </div>
);
