import moment from 'moment';
import classNames from 'classnames';

import { BondHistoryStats, EBondHistoryEventType } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

export const createAutocompoundJSX = (status: EBondHistoryEventType) => (
  <span
    className={classNames(
      styles.value,
      styles.capitalizeValue,
      styles.positive,
      {
        [styles.negative]: status === EBondHistoryEventType.Liquidated,
      },
      { [styles.primary]: status === EBondHistoryEventType.Creation },
    )}
  >
    {(status === EBondHistoryEventType.Creation ? 'loaned' : status) || '--'}
  </span>
);

export const createliquidatingAtJSX = (when = 0, signature: string) => (
  <a
    className={classNames(styles.value, styles.link)}
    href={`${process.env.SOLANAFM_URL}/address/${signature}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    {moment(moment.unix(when)).fromNow(false)}
  </a>
);

export const ReceiveCell = ({ stats }: { stats: BondHistoryStats }) => {
  const { received, state } = stats;

  if (typeof received === 'string')
    return (
      <span className={classNames(styles.value, styles.capitalizeValue)}>
        NFT collateral
      </span>
    );
  else if (received === 0)
    return (
      <span className={classNames(styles.value, styles.capitalizeValue)}>
        {'   '}
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
