import { FC } from 'react';

import styles from './TotalOverview.module.scss';
import {
  BASE_POINTS,
  DEFAULT_STANDART_INTEREST,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';

interface TotalOverviewProps {
  size?: number;
  duration?: number;
}

const TotalOverview: FC<TotalOverviewProps> = ({ size = 0, duration = 7 }) => {
  const estProfit =
    (size * (BASE_POINTS - DEFAULT_STANDART_INTEREST)) / BASE_POINTS;

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
