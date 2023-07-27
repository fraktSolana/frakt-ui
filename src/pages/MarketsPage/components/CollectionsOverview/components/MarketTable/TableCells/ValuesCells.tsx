import classNames from 'classnames';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { MarketPreview } from '@frakt/api/bonds';
import { convertAprToApy } from '@frakt/utils';

import styles from './TableCells.module.scss';

export const createOfferTvlJSX = (market: MarketPreview) => {
  const { offerTVL, activeOfferAmount } = market || {};

  const formattedBestOffer = parseFloat(offerTVL).toFixed(2);

  return (
    <div className={styles.column}>
      <span className={styles.value}>{formattedBestOffer}◎</span>
      <span className={styles.smallValue}>in {activeOfferAmount} offers</span>
    </div>
  );
};

export const createActiveLoansJSX = (market: MarketPreview) => {
  const { loansTVL, activeBondsAmount } = market || {};

  const formattedBestOffer = (loansTVL / 1e9 || 0).toFixed(2);

  return (
    <div className={styles.column}>
      <span className={styles.value}>{formattedBestOffer}◎</span>
      <span className={styles.smallValue}>in {activeBondsAmount} loans</span>
    </div>
  );
};

export const createBestOfferJSX = (market: MarketPreview) => {
  const { bestLTV, bestOffer } = market || {};

  const colorLTV =
    getColorByPercent(bestLTV, colorByPercentOffers) ||
    colorByPercentOffers[100];

  const formattedBestOffer = (bestOffer / 1e9 || 0).toFixed(1);
  const formattedBestLTV = bestLTV?.toFixed(0);

  return (
    <div className={styles.column}>
      <span className={styles.value}>{formattedBestOffer}◎</span>
      <span className={styles.smallValue} style={{ color: colorLTV }}>
        LTV {formattedBestLTV} %
      </span>
    </div>
  );
};

export const createDurationJSX = (durations: number[]) => (
  <span className={styles.value}>{durations?.length ? `7 days` : '--'}</span>
);

export const createApyJSX = (apr = 0) => {
  const apy = convertAprToApy(apr / 100) || 0;
  const formattedAPY = apy.toFixed(0);

  return (
    <span className={classNames(styles.value, styles.upToLtvColor)}>
      up to {formattedAPY} %
    </span>
  );
};
