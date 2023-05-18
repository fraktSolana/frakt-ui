import moment from 'moment';
import classNames from 'classnames';

import { BondStats } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

export const createAutocompoundJSX = (status: FraktBondState) => (
  <span
    className={classNames(
      styles.value,
      styles.capitalizeValue,
      styles.positive,
      {
        [styles.negative]: status === 'liquidated' || status === 'liquidating',
      },
      { [styles.primary]: status === 'active' },
    )}
  >
    {status || '--'}
  </span>
);

export const createliquidatingAtJSX = (when = 0, signature: string) => (
  <a
    className={classNames(styles.value, styles.link)}
    href={`${process.env.SOLANAFM_URL}/tx/${signature}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    {moment(moment.unix(when)).fromNow(false)}
  </a>
);

export const ReceiveCell = ({ stats }: { stats: BondStats }) => {
  const { received, state } = stats;

  if (typeof received === 'string')
    return (
      <span className={classNames(styles.value, styles.capitalizeValue)}>
        NFT collateral
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
