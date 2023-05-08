import { Market } from '@frakt/api/bonds';

import {
  DEFAULT_MAX_LOAN_VALUE_FOR_FLOOR_TYPE_OFFER,
  MAX_LOAN_VALUE,
} from './constants';
import { OfferTypes } from './types';

export const calculateLTV = ({
  market,
  maxLoanValue,
  offerType,
  ltv,
}: {
  market: Market;
  maxLoanValue: string;
  offerType: OfferTypes;
  ltv: number;
}): number => {
  const floorPriceSOL = market?.oracleFloor?.floor / 1e9;
  const maxLoanValueNumber = parseFloat(maxLoanValue);

  const fixedLTV = (maxLoanValueNumber / floorPriceSOL) * 100;
  const roundedFixedLTV = Math.trunc(fixedLTV);

  const rawLTV = offerType === OfferTypes.FIXED ? roundedFixedLTV : ltv;

  return rawLTV > 100 ? MAX_LOAN_VALUE : rawLTV;
};

export const calculateLtvByOfferType = (offerType: OfferTypes, ltv: number) => {
  if (offerType === OfferTypes.FIXED) return MAX_LOAN_VALUE;

  //? - 0.01 used to determine the type of offer
  return ltv - 0.01;
};

export const calculateMaxLoanValueByOfferType = (
  offerType: OfferTypes,
  maxLoanValue: string,
) => {
  const maxLoanValueNumber = parseFloat(maxLoanValue);

  if (offerType === OfferTypes.FLOOR && !maxLoanValueNumber)
    return DEFAULT_MAX_LOAN_VALUE_FOR_FLOOR_TYPE_OFFER;

  return maxLoanValueNumber;
};

export const getLoanToValueWithProtection = (
  floor: number,
  maxLoanValue: string,
): number => {
  const maxLoanValueNumber = parseFloat(maxLoanValue);
  const loanToValueWithProtection = Math.floor(
    (maxLoanValueNumber / floor) * 1e4,
  );

  const loanValue = loanToValueWithProtection / 100;
  return loanValue;
};
