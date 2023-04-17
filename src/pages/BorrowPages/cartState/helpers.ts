import { maxBy } from 'lodash';

import { Pair } from '@frakt/api/bonds';
import {
  BASE_POINTS,
  BONDS_PROTOCOL_FEE_IN_BASE_POINTS,
  BOND_DECIMAL_DELTA,
  pairLoanDurationFilter,
} from '@frakt/utils/bonds';
import { LoanType } from '@frakt/api/loans';

import { BondOrder } from './types';
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

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number | null; //? Doesn't Exist for LoanType.PRICE_BASED
  };
}

export const calcLtv = (order: BondOrder) => {
  const { borrowNft, loanValue } = order;
  const ltv = (loanValue / borrowNft.valuation) * 100;

  return ltv;
};

export const calcTimeBasedRepayValue = (order: BondOrder) => {
  const { loanValue } = order;

  const { fee, feeDiscountPercent } = order.borrowNft.classicParams.timeBased;

  const feeAmount = loanValue * (fee / loanValue);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return loanValue + feeAmountWithDiscount;
};

export const calcPriceBasedUpfrontFee = (order: BondOrder) => {
  const { loanValue } = order;

  return loanValue * 0.01;
};

type PatchPairWithProtocolFee = (pair: Pair) => Pair;
export const patchPairWithProtocolFee: PatchPairWithProtocolFee = (pair) => {
  return {
    ...pair,
    currentSpotPrice:
      pair.currentSpotPrice -
      (pair.currentSpotPrice * BONDS_PROTOCOL_FEE_IN_BASE_POINTS) / BASE_POINTS,
    baseSpotPrice:
      pair.baseSpotPrice -
      (pair.baseSpotPrice * BONDS_PROTOCOL_FEE_IN_BASE_POINTS) / BASE_POINTS,
  };
};
