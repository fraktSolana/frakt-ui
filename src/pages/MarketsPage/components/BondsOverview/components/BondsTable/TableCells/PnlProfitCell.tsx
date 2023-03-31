import { FC } from 'react';
import classNames from 'classnames';

import { BOND_SOL_DECIMAIL_DELTA } from '@frakt/utils/bonds';
import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

interface PnlProfitCellProps {
  bond: Bond;
}

export const PnlProfitCell: FC<PnlProfitCellProps> = ({ bond }) => {
  const { averageBondPrice } = bond;
  const { isExitAvailable, pnl: pnlValue } = bond?.stats;

  const pnlProfit = averageBondPrice
    ? pnlValue / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  return (
    <>
      {isExitAvailable && (
        <div className={classNames(styles.value, styles.column)}>
          <span>
            {pnlValue?.toFixed(3)} <Solana />
          </span>
          {!!pnlProfit && (
            <span
              className={classNames(styles.infoValueSpan, {
                [styles.negative]: pnlProfit < 0,
              })}
            >
              {pnlProfit > 0 && '+'}
              {pnlProfit?.toFixed(3)} %
            </span>
          )}
        </div>
      )}
      {!isExitAvailable && <EmptyValue />}
    </>
  );
};

const EmptyValue = (): JSX.Element => <div className={styles.value}>--</div>;
