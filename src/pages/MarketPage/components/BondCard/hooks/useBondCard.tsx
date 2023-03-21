import { useMemo } from 'react';
import { Bond, Market, Pair } from '@frakt/api/bonds';
import {
  isBondAvailableToRedeem,
  pairLoanDurationFilter,
} from '@frakt/utils/bonds';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';
import { getBestOrdersForExit } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';

export const useBondCardActions = ({
  bond,
  market,
  pairs,
}: {
  bond: Bond;
  market: Market;
  pairs: Pair[];
}) => {
  const redeemAvailable = isBondAvailableToRedeem(bond);

  console.log('pairs for exit: ', pairs);
  const bestOrdersAndBorrowValue = useMemo(() => {
    const { fbond, amountOfUserBonds } = bond;

    const ltvBasePoints =
      (fbond.amountToReturn / market?.oracleFloor?.floor) * 1e4;

    return getBestOrdersForExit({
      loanToValueFilter: ltvBasePoints,
      amountOfBonds: amountOfUserBonds,
      pairs: pairs.filter((p) =>
        pairLoanDurationFilter({
          pair: p,
          duration: (fbond.liquidatingAt - fbond.activatedAt) / (24 * 60 * 60),
        }),
      ),
    });
  }, [pairs, bond, market]);

  console.log('bestOrdersAndBorrowValue: ', bestOrdersAndBorrowValue);

  const exitAvailable =
    bond.fbond.fraktBondState === FraktBondState.Active &&
    bestOrdersAndBorrowValue.takenOrders.reduce(
      (sum, order) => order.orderSize + sum,
      0,
    );

  return {
    exitAvailable,
    redeemAvailable,
    bestOrdersAndBorrowValue,
  };
};
