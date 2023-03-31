import moment from 'moment';
import classNames from 'classnames';

import { Solana } from '@frakt/icons';
import { Bond, BondStats } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const createAutocompoundJSX = (autocompound: string) => (
  <span className={styles.value}>{autocompound || '--'}</span>
);

export const createReceiveJSX = (value = 0) => {
  if (typeof value === 'string')
    return <span className={styles.value}>{value}</span>;

  return (
    <span
      className={classNames(styles.value, {
        [styles.negative]: value < 0,
      })}
    >
      {value?.toFixed(2) || '--'} <Solana />
    </span>
  );
};

export const createliquidatingAtJSX = (value = 0) => (
  <span className={styles.value}>
    {moment(moment.unix(value)).fromNow(false)}
  </span>
);

export const ReceiveCell = ({ stats }: { stats: BondStats }) => {
  const { received, state } = stats;

  if (typeof received === 'string')
    return <span className={styles.value}>{received}</span>;

  return (
    <span
      className={classNames(styles.value, {
        [styles.positive]: received > 0,
        [styles.negative]: received < 0 && state !== 'repay',
      })}
    >
      {received?.toFixed(2) || '--'} <Solana />
    </span>
  );
};
