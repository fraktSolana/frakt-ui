import { FC } from 'react';

import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { DashboardColumnValue } from '../../../DashboardStatsValues';
import styles from './BorrowInfo.module.scss';

const BorrowInfo: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Borrow in bulk</h3>
      <div className={styles.stats}>
        <DashboardColumnValue label="Borrow up to" value={1234} />
        <DashboardColumnValue label="From your" value={567} />
      </div>
      <NavigationButton
        path={PATHS.BORROW_ROOT}
        className={styles.button}
        type="secondary"
      >
        Borrow $SOL in bulk
      </NavigationButton>
    </div>
  );
};

export default BorrowInfo;
