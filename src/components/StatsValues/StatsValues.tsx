import { FC, ReactNode } from 'react';
import cx from 'classnames';

import styles from './StatsValues.module.scss';

interface StatsValuesProps {
  className?: string;
  label: string;
  value?: number;
  icon?: boolean;
  children?: ReactNode;
}

export const StatsValues: FC<StatsValuesProps> = ({
  className,
  label,
  value,
  children,
  icon = true,
}) => {
  return (
    <div className={cx(styles.info, className)}>
      <p className={styles.label}>{label}</p>
      <span className={styles.value}>
        {children}
        {!children && icon ? <SolAmount solAmount={value} /> : value}
      </span>
    </div>
  );
};

interface StatsValuesColumnProps extends StatsValuesProps {
  textCenter?: boolean;
}

export const StatsValuesColumn: FC<StatsValuesColumnProps> = ({
  className,
  label,
  value,
  children,
  textCenter,
  icon = true,
}) => {
  return (
    <div className={cx(styles.column, className)}>
      <p className={styles.label}>{label}</p>
      <span
        className={cx(styles.columnValue, { [styles.textCenter]: textCenter })}
      >
        {children && children}
        {!children && icon ? <SolAmount solAmount={value} /> : value}
      </span>
    </div>
  );
};

export const SolAmount: FC<{ solAmount: number }> = ({ solAmount }) => {
  return <div className={styles.row}>◎{solAmount?.toFixed(2)}</div>;
};
