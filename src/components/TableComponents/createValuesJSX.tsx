import { Solana } from '@frakt/icons';

import styles from './TableComponents.module.scss';

export const createSolValueJSX = (value: number) => (
  <span className={styles.value}>
    {(value / 1e9 || 0).toFixed(2)} <Solana />
  </span>
);

export const createPercentValueJSX = (value: number) => (
  <span className={styles.value}>
    {value ? `${value.toFixed(0)} %` : '--'}
  </span>
);
