import { FC } from 'react';

import { Solana } from '@frakt/icons';
import styles from './DashboardStatsValues.module.scss';

interface DashboardStatsValuesProps {
  label: string;
  value?: number;
}

export const DashboardStatsValues: FC<DashboardStatsValuesProps> = ({
  label,
  value,
}) => {
  return (
    <div className={styles.stats}>
      <h3 className={styles.label}>{label}</h3>
      <p className={styles.value}>
        {value?.toFixed(2) || '--'} <Solana className={styles.icon} />
      </p>
    </div>
  );
};
