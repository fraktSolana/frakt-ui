import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { helpers } from 'fbonds-core/lib/fbond-protocol';
import {
  BondingCurveType,
  OrderType,
} from 'fbonds-core/lib/fbond-protocol/types';
import { Point } from '../types';

type UsePriceGraph = (props: {
  spotPrice: number;
  delta: number;
  bondingCurve: BondingCurveType;
  buyOrdersAmount?: number;
  mathCounter?: number;
}) => Point[] | null;

export const usePriceGraph: UsePriceGraph = ({
  spotPrice = 0,
  delta = 0,
  bondingCurve,
  buyOrdersAmount = 10,
  mathCounter = 0,
}) => {
  if (!bondingCurve || !spotPrice) return null;

  const spotPricePercent = BOND_DECIMAL_DELTA - spotPrice * 100;

  const { array: priceArray } = helpers.calculatePricesArray({
    starting_spot_price: spotPricePercent,
    delta: delta * 100,
    amount: buyOrdersAmount,
    bondingCurveType: bondingCurve,
    orderType: OrderType.Sell,
    counter: mathCounter,
  }) as { array: number[]; total: number };

  const points = priceArray.map((price, i) => {
    const newPrice = (BOND_DECIMAL_DELTA - price) / 100;
    return {
      order: 1 + i,
      price: newPrice,
    };
  }) as Point[];

  return points;
};
