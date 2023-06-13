import { FC } from 'react';

import { BorrowMode } from '@frakt/pages/BorrowPages/types';
import { ModeSwitcher } from '@frakt/pages/BorrowPages/components/ModeSwitcher';

import styles from './RootHeader.module.scss';

interface RootHeaderProps {
  collateralsAmount?: number;
  availableToBorrow?: number;
  mode: BorrowMode;
  onModeSwitch: () => void;
}

export const RootHeader: FC<RootHeaderProps> = ({
  collateralsAmount,
  availableToBorrow,
  mode,
  onModeSwitch,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headingWrapper}>
        <h1>Borrow SOL</h1>
        <ModeSwitcher value={mode} onClick={onModeSwitch} />
      </div>

      {(!!collateralsAmount || !!availableToBorrow) && (
        <div className={styles.headerStatsWrapper}>
          {!!collateralsAmount && (
            <div className={styles.headerStats}>
              <span>Your NFTs:</span>
              <span>{collateralsAmount}</span>
            </div>
          )}
          {!!availableToBorrow && (
            <div className={styles.headerStats}>
              <span>Max borrow:</span>
              <span>{availableToBorrow.toFixed(2)} ◎</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
