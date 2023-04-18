import { BorrowNft } from '@frakt/api/nft';
import { BASE_POINTS, BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { Pair } from '@frakt/api/bonds';
import { BondOrder } from './cartState';

type CalcLtv = (props: { nft: BorrowNft; loanValue: number }) => number;
export const calcLtv: CalcLtv = ({ nft, loanValue }) => {
  const ltv = (loanValue / nft.valuation) * 100;

  return ltv;
};

type CalcPriceBasedUpfrontFee = (props: { loanValue: number }) => number;
export const calcPriceBasedUpfrontFee: CalcPriceBasedUpfrontFee = ({
  loanValue,
}) => {
  return loanValue * 0.01;
};

type CalcTimeBasedFee = (props: {
  nft: BorrowNft;
  loanValue: number;
  duration?: number;
}) => number;
export const calcTimeBasedFee: CalcTimeBasedFee = ({
  nft,
  loanValue,
  duration,
}) => {
  const {
    fee: feeAllTIme,
    returnPeriodDays,
    ltvPercent,
    feeDiscountPercent,
  } = nft.classicParams.timeBased;

  const ltv = calcLtv({
    loanValue,
    nft,
  });

  const feePerDayMaxLTV = feeAllTIme / returnPeriodDays;

  const ltvDiff = ltv / ltvPercent;

  const feeAmount = feePerDayMaxLTV * ltvDiff * (duration ?? returnPeriodDays);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return feeAmountWithDiscount;
};

type CalcTimeBasedRepayValue = (props: {
  nft: BorrowNft;
  loanValue: number;
}) => number;
export const calcTimeBasedRepayValue: CalcTimeBasedRepayValue = ({
  nft,
  loanValue,
}) => {
  const fee = calcTimeBasedFee({
    nft,
    loanValue,
  });

  return loanValue + fee;
};

// type CalcBondFee = (props: { loanValue: number; pair: Pair }) => number;
// export const calcBondFee: CalcBondFee = ({ loanValue, pair }) => {
//   const { currentSpotPrice } = pair;

//   const feeLamports =
//     (loanValue * BOND_DECIMAL_DELTA) / currentSpotPrice - loanValue;

//   return feeLamports;
// };

type CalcBondMultiOrdersFee = (order: BondOrder) => number;
export const calcBondMultiOrdersFee: CalcBondMultiOrdersFee = (order) => {
  const feeLamports = order.bondOrderParams.orderParams.reduce(
    (feeSum, orderParam) =>
      feeSum + orderParam.orderSize * (BASE_POINTS - orderParam.spotPrice),
    0,
  );
  return feeLamports;
};

type CalcDurationByMultiOrdersBond = (order: BondOrder) => number;
export const calcDurationByMultiOrdersBond: CalcDurationByMultiOrdersBond = (
  order,
) => {
  const duration = order.bondOrderParams.orderParams.reduce(
    (maxDuration, orderParam) =>
      Math.max(maxDuration, orderParam.durationFilter),
    0,
  );
  return duration;
};
