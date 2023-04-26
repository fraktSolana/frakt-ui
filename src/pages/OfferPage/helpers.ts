import { Market } from '@frakt/api/bonds';

import { MAX_LOAN_VALUE } from './constants';
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
