import classNames from 'classnames';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { MarketPreview } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const createSolValueJSX = (value?: string) => (
  <span className={styles.value}>
    {value} <Solana />
  </span>
);

export const createActiveLoansJSX = (value = 0) => (
  <span className={styles.value}>{value || 0}</span>
);

export const createOfferTvlJSX = (value?: string) => (
  <span className={styles.value}>
    {parseFloat(value)?.toFixed(1)} <Solana />
  </span>
);

export const createBestOfferJSX = (market: MarketPreview) => {
  const colorLTV =
    getColorByPercent(market?.bestLTV, colorByPercentOffers) ||
    colorByPercentOffers[100];

  return (
    <div className={styles.column}>
      <span className={styles.value}>
        {(market?.bestOffer / 1e9 || 0).toFixed(1)} <Solana />
      </span>
      <span style={{ color: colorLTV }} className={styles.smallValue}>
        LTV {market?.bestLTV?.toFixed(0)} %
      </span>
    </div>
  );
};

export const createDurationJSX = (value: number[]) => {
  const durations = value.sort((a, b) => b - a);
  return (
    <span className={styles.value}>
      {durations?.length ? `${durations?.join(' / ')} days` : '--'}
    </span>
  );
};

export const createHighestLtvJSX = (value = 0) => (
  <span className={classNames(styles.value, styles.highestLtvColor)}>
    {value?.toFixed(0)} %
  </span>
);

export const createAprJSX = (value) => (
  <span className={classNames(styles.value, styles.upToLtvColor)}>
    up to {(value || 0).toFixed(0)} %
  </span>
);
