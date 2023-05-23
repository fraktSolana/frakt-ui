import { FC } from 'react';

import styles from './TotalOverview.module.scss';

interface TotalOverviewProps {
  size?: number;
  interest?: number;
  duration?: number;
}

const TotalOverview: FC<TotalOverviewProps> = ({
  size = 0,
  interest = 0,
  duration = 7,
}) => {
  const estProfit = size * (interest / 1e2);

  return (
    <div className={styles.total}>
      <h5 className={styles.blockTitle}>
        {(estProfit || 0).toFixed(2)} SOL in {duration} days
      </h5>
      <span className={styles.blockSubtitle}>estimated profit</span>
    </div>
  );
};

export default TotalOverview;
