import { FC } from 'react';
import classNames from 'classnames';

import styles from './Sort.module.scss';

interface SortProps {
  openOffersMobile?: boolean;
  existSyntheticParams?: boolean;
}

const Sort: FC<SortProps> = ({ openOffersMobile, existSyntheticParams }) => {
  return (
    <div
      className={classNames(styles.columnWrapper, {
        [styles.active]: openOffersMobile,
        [styles.create]: existSyntheticParams,
      })}
    >
      <div className={styles.col}>
        <span className={styles.colName}>size (SOL)</span>
      </div>
      <div className={styles.col}>
        <span className={styles.colName}>Interest (%)</span>
      </div>
    </div>
  );
};

export default Sort;
