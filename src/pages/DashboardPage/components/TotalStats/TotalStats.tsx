import { FC } from 'react';

import { TotalStats as TotalStatsInterface } from '@frakt/api/user';

import { DashboardColumnValue, VALUES_TYPES } from '../DashboardStatsValues';
import styles from './TotalStats.module.scss';

interface TotalStatsProps {
  data: TotalStatsInterface;
}

const TotalStats: FC<TotalStatsProps> = ({ data }) => {
  return (
    <div className={styles.block}>
      <h2 className={styles.title}>Total stats</h2>
      <div className={styles.statsWrapper}>
        <DashboardColumnValue
          label="Total value locked"
          value={data?.loansTvl || '--'}
          toFixed={0}
          reverse
        />
        <DashboardColumnValue
          label="Loans volume all time"
          value={data?.loansVolumeAllTime || '--'}
          toFixed={0}
          reverse
        />
        <DashboardColumnValue
          label="Active loans"
          value={data?.activeLoansCount || '--'}
          toFixed={0}
          valueType={VALUES_TYPES.string}
          reverse
        />
      </div>
    </div>
  );
};

export default TotalStats;
