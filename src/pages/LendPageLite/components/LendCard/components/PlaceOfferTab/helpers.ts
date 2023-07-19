import { MarketOrder } from '@frakt/pages/MarketsPage/components/OrderBook/types';
import { BASE_POINTS } from '@frakt/utils/bonds';

export const calculateLoanValue = (offer: MarketOrder, marketFloor: number) => {
  const { interest, rawData } = offer;

  const loanToValueFixed = rawData?.maxReturnAmountFilter;

  const loanToValueFloor =
    (rawData.loanToValueFilter / BASE_POINTS) * marketFloor;

  const loanValue =
    Math.min(loanToValueFixed, loanToValueFloor) * (1 - interest);

  return loanValue;
};

export const shouldShowDepositError = (
  initialEditValues: { loanValue: string; loanAmount: string },
  solanaBalance: number,
  offerSize: number,
) => {
  const loanAmount = parseFloat(initialEditValues?.loanAmount) || 0;
  const loanValue = parseFloat(initialEditValues?.loanValue) || 0;

  const initialLoanSize = loanAmount * loanValue;
  const totalAvailableSize = initialLoanSize + solanaBalance;

  const isDepositErrorShown = totalAvailableSize < offerSize;
  return isDepositErrorShown;
};
