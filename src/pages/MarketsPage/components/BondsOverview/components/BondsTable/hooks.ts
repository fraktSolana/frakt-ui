import { useMemo } from 'react';

import { getBestOrdersForExit } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { FraktBondState } from 'fbonds-core/lib/fbond-protocol/types';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import {
  BOND_DECIMAL_DELTA,
  isBondAvailableToRedeem,
  pairLoanDurationFilter,
} from '@frakt/utils/bonds';
import moment from 'moment';

export const useBondActions = ({
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
          duration:
            (fbond.liquidatingAt - moment.utc().unix()) / (24 * 60 * 60),
        }),
      ),
    });
  }, [pairs, bond, market]);

  const exitAvailable =
    bond.fbond.fraktBondState === FraktBondState.Active &&
    bestOrdersAndBorrowValue.takenOrders.reduce(
      (sum, order) => order.orderSize + sum,
      0,
    ) >= bond.amountOfUserBonds;

  // const amountOfUserBonds = getMyBondBalance(bond) ? getMyBondBalance(bond) : (bond.fbond.amountToReturn / BOND_DECIMAL_DELTA) /
  // const amountOfUserBondsUi = amountOfUserBonds / BOND_SOL_DECIMAL_DELTA
  // const size = bond.fbond.actualReturnedAmount > 0 ?
  // bond.fbond.actualReturnedAmount / (bond.fbond.amountToReturn / BOND_DECIMAL_DELTA) * amountOfUserBonds
  // : amountOfUserBonds * BOND_DECIMAL_DELTA
  return {
    exitAvailable,
    redeemAvailable,
    bestOrdersAndBorrowValue,
  };
};
