import { FC } from 'react';
import classNames from 'classnames';

import { Bond } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

interface PnlProfitCellProps {
  bond: Bond;
}

export const PnlProfitCell: FC<PnlProfitCellProps> = ({ bond }) => {
  const { isExitAvailable, pnl: pnlValue, pnlProfit } = bond?.stats;

  return (
    <>
      {isExitAvailable && (
        <div className={classNames(styles.value, styles.column)}>
          <span
            className={classNames(styles.infoValueSpan, {
              [styles.negative]: pnlProfit < 0,
            })}
          >
            {(pnlValue || 0)?.toFixed(3)}◎
          </span>

          {isExitAvailable && (
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
