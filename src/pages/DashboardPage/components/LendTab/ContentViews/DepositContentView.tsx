import { FC } from 'react';
import { NavigationButton } from '@frakt/components/Button';

import { DashboardColumnValue, VALUES_TYPES } from '../../DashboardStatsValues';
import HorizontalBar from '../../HorizontalBar';
import Heading from '../../Heading';

import styles from './ContentViews.module.scss';
import { useSolanaBalance } from '@frakt/utils/accounts';

interface DepositContentViewProps {
  data: number[];
  labels: string[];
  title: string;
  tooltipText?: string;
  apr: number;
  buttonText: string;
  path: string;
}

const defaultsColors = {
  others: '#34C759',
  'idle in wallet': '#FFC01F',
};

export const DepositContentView: FC<DepositContentViewProps> = ({
  data,
  labels,
  title,
  tooltipText,
  apr,
  buttonText,
  path,
}) => {
  const { balance: userBalance } = useSolanaBalance();
  const colors = labels.map((color) => defaultsColors[color] || '#1FAEFF');

  return (
    <div className={styles.depositContainer}>
      <div className={styles.depositContent}>
        <div className={styles.depositInfoWrapper}>
          <Heading title={title} tooltipText={tooltipText} />
          <DashboardColumnValue
            label="Weighted apr"
            value={apr?.toFixed(2)}
            valueType={VALUES_TYPES.percent}
            className={styles.value}
            reverse
          />
        </div>
        <div className={styles.chartBarWrapper}>
          <HorizontalBar
            data={data}
            labels={labels}
            colors={colors}
            userBalance={userBalance}
          />
        </div>
      </div>
      <NavigationButton className={styles.navigationButton} path={path}>
        {buttonText}
      </NavigationButton>
    </div>
  );
};
