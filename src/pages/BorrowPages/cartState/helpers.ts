import { maxBy } from 'lodash';

import { Pair } from '@frakt/api/bonds';
import { BOND_DECIMAL_DELTA, pairLoanDurationFilter } from '@frakt/utils/bonds';
import { LoanType } from '@frakt/api/loans';

import { BondOrder } from './types';
import { Order } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { BondOrderParams } from '@frakt/api/nft';

type GetPairMaxBorrowValue = (params: {
  pair: Pair;
  collectionFloor: number;
}) => number; //? lamports
export const getPairMaxBorrowValue: GetPairMaxBorrowValue = ({
  pair,
  collectionFloor,
}) => {
  const loanToValueLamports =
    collectionFloor * (pair.validation.loanToValueFilter / 1e4);
  const maxValueBonds = Math.min(
    pair.edgeSettlement,
    loanToValueLamports / BOND_DECIMAL_DELTA,
  );
  return maxValueBonds * pair.currentSpotPrice;
};

type GetPairWithMaxBorrowValue = (params: {
  pairs: Pair[];
  collectionFloor: number;
  duration?: number;
}) => Pair;
export const getPairWithMaxBorrowValue: GetPairWithMaxBorrowValue = ({
  pairs,
  collectionFloor,
  duration = 7, //? Days
}) => {
  const suitablePairsByDuration = pairs.filter((p) =>
    pairLoanDurationFilter({ pair: p, duration }),
  );

  const pairWithMaxBorrowValue = maxBy(suitablePairsByDuration, (p) =>
    getPairMaxBorrowValue({ pair: p, collectionFloor }),
  );

  return pairWithMaxBorrowValue;
};

type ConvertTakenOrdersToOrderParams = (params: {
  pairs: Pair[];
  takenOrders: Order[];
}) => BondOrderParams[];
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

type CalcBondFee = (props: { order: BondOrder; pair: Pair }) => number;
export const calcBondFee: CalcBondFee = ({ order, pair }) => {
  const { loanValue } = order;
  const { currentSpotPrice } = pair;

  const feeLamports =
    (loanValue * BOND_DECIMAL_DELTA) / currentSpotPrice - loanValue;

  return feeLamports;
};
