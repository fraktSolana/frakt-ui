import { maxBy } from 'lodash';

import { Pair } from '@frakt/api/bonds';
import { BOND_DECIMAL_DELTA, pairLoanDurationFilter } from '@frakt/utils/bonds';
import { LoanType } from '@frakt/api/loans';

import { CartOrder } from './types';
import { Order } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { BondCartOrder } from '@frakt/api/nft';

type ConvertTakenOrdersToOrderParams = (params: {
  pairs: Pair[];
  takenOrders: Order[];
}) => BondCartOrder[];
export const convertTakenOrdersToOrderParams: ConvertTakenOrdersToOrderParams =
  ({ pairs, takenOrders }) => {
    return takenOrders.map((takenOrder) => ({
      orderSize: takenOrder.orderSize,
      spotPrice: takenOrder.pricePerShare,
      pairPubkey: takenOrder.pairPubkey,
      assetReceiver: pairs.find(
        (pair) => pair.publicKey === takenOrder.pairPubkey,
      ).assetReceiver,
      durationFilter: pairs.find(
        (pair) => pair.publicKey === takenOrder.pairPubkey,
      ).validation.durationFilter,
      bondFeature: pairs.find(
        (pair) => pair.publicKey === takenOrder.pairPubkey,
      ).validation.bondFeatures,
    }));
  };

type ConvertTakenOrderToOrderParams = (params: {
  pair: Pair;
  takenOrder: Order;
}) => BondCartOrder;
export const convertTakenOrderToOrderParams: ConvertTakenOrderToOrderParams = ({
  pair,
  takenOrder,
}) => ({
  orderSize: takenOrder.orderSize,
  spotPrice: takenOrder.pricePerShare,
  pairPubkey: takenOrder.pairPubkey,
  assetReceiver: pair.assetReceiver,
  durationFilter: pair.validation.durationFilter,
  bondFeature: pair.validation.bondFeatures,
});

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number | null; //? Doesn't Exist for LoanType.PRICE_BASED
  };
}

export const calcLtv = (order: CartOrder) => {
  const { borrowNft, loanValue } = order;
  const ltv = (loanValue / borrowNft.valuation) * 100;

  return ltv;
};

export const calcTimeBasedRepayValue = (order: CartOrder) => {
  const { loanValue } = order;

  const { fee, feeDiscountPercent } = order.borrowNft.classicParams.timeBased;

  const feeAmount = loanValue * (fee / loanValue);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return loanValue + feeAmountWithDiscount;
};

export const calcPriceBasedUpfrontFee = (order: CartOrder) => {
  const { loanValue } = order;

  return loanValue * 0.01;
};

type CalcBondFee = (props: { order: CartOrder; pair: Pair }) => number;
export const calcBondFee: CalcBondFee = ({ order, pair }) => {
  const { loanValue } = order;
  const { currentSpotPrice } = pair;

  const feeLamports =
    (loanValue * BOND_DECIMAL_DELTA) / currentSpotPrice - loanValue;

  return feeLamports;
};
