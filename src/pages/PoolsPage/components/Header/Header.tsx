import { FC } from 'react';

import { StatsValues } from '@frakt/components/StatsValues';
import styles from './Header.module.scss';

const Header: FC<{ totalDeposited: number; totalRewards: number }> = ({
  totalDeposited,
  totalRewards,
}) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Pools</h2>
      <div className={styles.stats}>
        <StatsValues
          className={styles.values}
          label="Deposited:"
          value={totalDeposited || 0}
        />
        <StatsValues
          className={styles.values}
          label="Rewards:"
          value={totalRewards || 0}
        />
      </div>
    </div>
  );
};

export default Header;
