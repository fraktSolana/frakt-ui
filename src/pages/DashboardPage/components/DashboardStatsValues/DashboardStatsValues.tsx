import { FC, PropsWithChildren } from 'react';

import { Solana } from '@frakt/icons';
import styles from './DashboardStatsValues.module.scss';
import classNames from 'classnames';

interface DashboardStatsValuesProps {
  label: string;
  value?: number;
  className?: string;
  size?: 'large' | 'medium';
}

export const DashboardColumnValue: FC<
  PropsWithChildren<DashboardStatsValuesProps>
> = ({ label, className, value, children, size = 'large' }) => (
  <div
    className={classNames(styles.column, className, {
      [styles.medium]: size === 'medium',
    })}
  >
    <p className={styles.label}>{label}</p>
    {children && children}
    {!children && (
      <p className={styles.value}>
        {value?.toFixed(2) || '--'} <Solana className={styles.icon} />
      </p>
    )}
  </div>
);
