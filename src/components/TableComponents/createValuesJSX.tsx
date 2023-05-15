import moment from 'moment';

import { colorByPercentHealth, getColorByPercent } from '@frakt/utils/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableComponents.module.scss';

export const createSolValueJSX = (value: number) => (
  <span className={styles.value}>
    {!!value && (
      <>
        {(value / 1e9 || 0).toFixed(2)} <Solana />
      </>
    )}
    {!value && '--'}
  </span>
);

export const createPercentValueJSX = (value: number) => (
  <span className={styles.value}>{value ? `${value.toFixed(0)} %` : '--'}</span>
);

export const createHighlitedPercentValueJSX = (value: number) => {
  const colorLTV =
    getColorByPercent(value, colorByPercentHealth) || colorByPercentHealth[100];

  return (
    <div className={styles.value}>
      <span style={{ color: `${colorLTV}` }}>
        {!!value && `${value.toFixed(0)} %`}
      </span>
      {!value && <span>--</span>}
    </div>
  );
};

export const createValueJSX = (value: string | number) => (
  <span className={styles.value}>{value || '--'}</span>
);

export const createValueTimeJSX = (value: number) => (
  <span className={styles.value}>
    {!value && '--'}
    {!!value && moment.unix(value).fromNow(false)}
  </span>
);
