import { FC } from 'react';
import { NavigationButton } from '@frakt/components/Button';

import { DashboardColumnValue, VALUES_TYPES } from '../../DashboardStatsValues';
import HorizontalBar from '../../HorizontalBar';
import Heading from '../../Heading';

import styles from './DepositContentView.module.scss';

interface DepositContentViewProps {
  data: number[];
  labels: string[];
  title: string;
  tooltipText?: string;
  apr: number;
  buttonText: string;
  path: string;
}

const DepositContentView: FC<DepositContentViewProps> = ({
  data,
  labels,
  title,
  tooltipText,
  apr,
  buttonText,
  path,
}) => (
  <div className={styles.depositContainer}>
    <div className={styles.depositContent}>
      <div className={styles.depositInfoWrapper}>
        <Heading title={title} tooltipText={tooltipText} />
        <DashboardColumnValue
          label="Deposit weightet apr"
          value={apr?.toFixed(0)}
          valueType={VALUES_TYPES.percent}
          reverse
        />
      </div>
      <div className={styles.chartBarWrapper}>
        <HorizontalBar data={data} labels={labels} />
      </div>
    </div>
    <NavigationButton className={styles.navigationButton} path={path}>
      {buttonText}
    </NavigationButton>
  </div>
);

export default DepositContentView;
