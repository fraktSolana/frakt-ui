import { FC } from 'react';
import classNames from 'classnames';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';

import styles from './TableCells.module.scss';

interface SizeCellProps {
  ltv: number;
  size: number;
}

export const SizeCell: FC<SizeCellProps> = ({ ltv, size }) => {
  const colorLTV =
    getColorByPercent(ltv, colorByPercentOffers) || colorByPercentOffers[100];

  return (
    <div className={styles.column}>
      <span className={styles.value}>{(size || 0).toFixed(2)}◎</span>
      <span
        style={{ color: colorLTV }}
        className={classNames(
          styles.value,
          styles.valueSmall,
          styles.highestLtvColor,
        )}
      >
        {Math.trunc(ltv)}% LTV
      </span>
    </div>
  );
};
