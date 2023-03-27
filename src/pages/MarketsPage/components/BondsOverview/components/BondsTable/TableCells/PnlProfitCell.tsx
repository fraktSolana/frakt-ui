import { FC } from 'react';
import classNames from 'classnames';

import { BOND_SOL_DECIMAIL_DELTA } from '@frakt/utils/bonds';
import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import { getMarketAndPairsByBond } from '../helpers';
import { useBondActions } from '../hooks';

import styles from './TableCells.module.scss';

interface PnlProfitCellProps {
  bond: Bond;
}

export const PnlProfitCell: FC<PnlProfitCellProps> = ({ bond }) => {
  const { market, pairs } = getMarketAndPairsByBond(bond);

  const { pnl: pnlLamports } = bond?.stats;
  const { averageBondPrice } = bond;

  console.log('getMarketAndPairsByBond: ', pairs);

  const { exitAvailable } = useBondActions({
    bond,
    market,
    pairs,
  });

  const pnlProfit = averageBondPrice
    ? pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  return (
    <>
      {!!exitAvailable && (
        <div className={classNames(styles.value, styles.column)}>
          <span>
            {(pnlLamports / 1e9).toFixed(3)} <Solana />
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
      {!exitAvailable && <EmptyValue />}
    </>
  );
};

const EmptyValue = (): JSX.Element => <div className={styles.value}>--</div>;
