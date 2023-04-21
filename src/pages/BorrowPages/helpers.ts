import { BorrowNft } from '@frakt/api/nft';
import { BASE_POINTS } from '@frakt/utils/bonds';
import { BondOrderParams } from './cartState';

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

type CalcBondMultiOrdersFee = (bondOrderParams: BondOrderParams) => number;
export const calcBondMultiOrdersFee: CalcBondMultiOrdersFee = (
  bondOrderParams,
) => {
  const feeLamports = bondOrderParams.orderParams.reduce(
    (feeSum, orderParam) =>
      feeSum + orderParam.orderSize * (BASE_POINTS - orderParam.spotPrice),
    0,
  );
  return feeLamports;
};

type CalcDurationByMultiOrdersBond = (
  bondOrderParams: BondOrderParams,
) => number;
export const calcDurationByMultiOrdersBond: CalcDurationByMultiOrdersBond = (
  bondOrderParams,
) => {
  const duration = bondOrderParams.orderParams.reduce(
    (maxDuration, orderParam) =>
      Math.max(maxDuration, orderParam.durationFilter),
    0,
  );
  return duration;
};
