import { FC, useEffect } from 'react';
import classNames from 'classnames';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';
import {
  BOND_SOL_DECIMAIL_DELTA,
  pairLoanDurationFilter,
} from '@frakt/utils/bonds';

import { useBondCardActions } from '../../BondCard/hooks/useBondCard';
import { getMarketAndPairsByBond } from '../helpers';
import styles from './TableCells.module.scss';
import { getBestOrdersForExit } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';

interface PnlProfitCellProps {
  bond: Bond;
  inMobile?: boolean;
  setCurrentMarketAndPairs?: ({
    market,
    pairs,
  }: {
    market: Market;
    pairs: Pair[];
  }) => void;
}

export const PnlProfitCell: FC<PnlProfitCellProps> = ({
  bond,
  inMobile,
  setCurrentMarketAndPairs,
}) => {
  const { market, pairs } = getMarketAndPairsByBond(bond);

  const { amountOfUserBonds, averageBondPrice } = bond;

  const { exitAvailable, bestOrdersAndBorrowValue } = useBondCardActions({
    bond,
    market,
    pairs,
  });

  useEffect(() => {
    setCurrentMarketAndPairs({ market, pairs });
  }, [market]);

  const pnlLamports = bestOrdersAndBorrowValue.maxBorrowValue;

  const pnlProfit = averageBondPrice
    ? pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  return (
    <>
      {exitAvailable && (
        <div
          className={classNames(styles.value, styles.column, {
            [styles.columnMobile]: inMobile,
          })}
        >
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

export const calcPnlProfit = ({ bond, market, pairs }) => {
  const { fbond, amountOfUserBonds, averageBondPrice } = bond;

  const ltvBasePoints =
    (fbond.amountToReturn / market?.oracleFloor?.floor) * 1e4;

  const bestOrdersAndBorrowValue = getBestOrdersForExit({
    loanToValueFilter: ltvBasePoints,
    amountOfBonds: amountOfUserBonds,
    pairs: pairs.filter((p) =>
      pairLoanDurationFilter({
        pair: p,
        duration: (fbond.liquidatingAt - fbond.activatedAt) / (24 * 60 * 60),
      }),
    ),
  });

  const pnlLamports = bestOrdersAndBorrowValue.maxBorrowValue;

  const pnlProfit = averageBondPrice
    ? pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  return pnlProfit;
};
