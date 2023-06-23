import { FC } from 'react';
import classNames from 'classnames';

import { Alert, Solana } from '@frakt/icons';
import Button from '@frakt/components/Button';
import { CartOrder, useBorrow } from '@frakt/pages/BorrowPages/cartState';

import Checkbox from '@frakt/components/Checkbox';

import styles from './OverviewSidebar.module.scss';
import { Pair } from '@frakt/api/bonds';
import { calcCartFees, isBulkHasDifferentDurations } from './helpers';

interface OverviewSidebarProps {
  orders: CartOrder[];
  pairs: Pair[];
  onChangeAssets: () => void;
  onBorrow: () => void;
  isLedger: boolean;
  setIsLedger?: (value: boolean) => void;
}

export const OverviewSidebar: FC<OverviewSidebarProps> = ({
  orders,
  pairs,
  onChangeAssets,
  onBorrow,
  isLedger,
  setIsLedger,
}) => {
  const { totalBorrowValue } = useBorrow();

  const fees = calcCartFees({
    pairs,
    orders,
  });

  const isDifferentDurations = isBulkHasDifferentDurations({
    orders,
    pairs,
  });

  return (
    <div className={styles.sidebar}>
      <p className={styles.title}>Borrowing info</p>
      <div className={styles.feesWrapper}>
        {fees.map(([label, value]) =>
          value ? (
            <div key={label} className={styles.feesRow}>
              <p className={styles.subtitle}>Fee on {label}</p>
              <p className={styles.value}>{(value / 1e9).toFixed(3)}◎</p>
            </div>
          ) : null,
        )}
      </div>

      {isDifferentDurations && (
        <div className={styles.differentDurationsMsg}>
          <Alert />
          Please note that you have loans with different durations
        </div>
      )}

      <div
        className={classNames(styles.checkboxWrapper, {
          [styles.checkboxMarginTop]: isDifferentDurations || !!fees.length,
        })}
      >
        <Checkbox
          onChange={() => setIsLedger(!isLedger)}
          label="I use ledger"
          checked={isLedger}
        />
      </div>

      <div className={styles.sidebarBtnWrapper}>
        <Button type="secondary" onClick={onBorrow} className={styles.btn}>
          Borrow {(totalBorrowValue / 1e9)?.toFixed(2)} SOL
        </Button>
        <Button onClick={onChangeAssets} className={styles.btn}>
          Change assets
        </Button>
      </div>
    </div>
  );
};
