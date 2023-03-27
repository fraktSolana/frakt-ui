import { FC } from 'react';
import classNames from 'classnames';

import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';
import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';

import styles from './TableCells.module.scss';

export const SizeCell: FC<{ bond: Bond; isMobile?: boolean }> = ({
  bond,
  isMobile,
}) => {
  const { ltv, size } = bond?.stats;

  const colorLTV =
    getColorByPercent(ltv, colorByPercentOffers) || colorByPercentOffers[100];

  return (
    <div
      className={classNames(styles.column, {
        [styles.columnMobile]: isMobile,
      })}
    >
      <span className={styles.value}>
        {(size || 0).toFixed(2)}
        <Solana />
      </span>
      <span
        style={{ color: colorLTV }}
        className={classNames(styles.value, styles.highestLtvColor)}
      >
        {(ltv || 0)?.toFixed(0)}% LTV
      </span>
    </div>
  );
};
