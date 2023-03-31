import moment from 'moment';
import classNames from 'classnames';

import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const createAutocompoundJSX = (autocompound: string) => (
  <span className={styles.value}>{autocompound || '--'}</span>
);

export const createReceiveJSX = (value = 0) => {
  if (typeof value === 'string')
    return <span className={styles.value}>{value}</span>;

  return (
    <span
      className={classNames(styles.infoValueSpan, {
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
