import { FC } from 'react';

import { DailyActivity } from '@frakt/api/user';

import { DashboardColumnValue, VALUES_TYPES } from '../DashboardStatsValues';
import styles from './DailyActive.module.scss';

interface DailyStatsProps {
  data: DailyActivity;
}

const DailyActive: FC<DailyStatsProps> = ({ data }) => {
  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Daily Stats</h2>
      <div className={styles.statsWrapper}>
        <DashboardColumnValue
          label="Volume"
          value={data?.dailyVolume || '--'}
          toFixed={0}
          reverse
        />
        <DashboardColumnValue
          label="Issued"
          value={data?.issuedIn24Hours || '--'}
          valueType={VALUES_TYPES.string}
          toFixed={0}
          reverse
        />
        <DashboardColumnValue
          label="Paid back"
          value={data?.paidBackIn24Hours || '--'}
          valueType={VALUES_TYPES.string}
          toFixed={0}
          reverse
        />
        <DashboardColumnValue
          label="Graced"
          value={data?.liquidatedIn24Hours || '--'}
          valueType={VALUES_TYPES.string}
          toFixed={0}
          reverse
        />
      </div>
    </div>
  );
};

export default DailyActive;
