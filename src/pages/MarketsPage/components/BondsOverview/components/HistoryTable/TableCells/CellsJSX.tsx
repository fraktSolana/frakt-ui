import moment from 'moment';
import classNames from 'classnames';

import { BondStats, BondsStatsStatus } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const createAutocompoundJSX = (status: BondsStatsStatus) => (
  <span
    className={classNames(
      styles.value,
      styles.capitalizeValue,
      styles.positive,
      {
        [styles.negative]: status === 'liquidated' || status === 'liquidating',
      },
    )}
  >
    {status || '--'}
  </span>
);

export const createliquidatingAtJSX = (value = 0) => (
  <span className={styles.value}>
    {moment(moment.unix(value)).fromNow(false)}
  </span>
);

export const ReceiveCell = ({ stats }: { stats: BondStats }) => {
  const { received, state } = stats;

  if (typeof received === 'string')
    return (
      <span className={classNames(styles.value, styles.capitalizeValue)}>
        {received}
      </span>
    );

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
