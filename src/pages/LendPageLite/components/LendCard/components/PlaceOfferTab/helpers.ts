import { MarketOrder } from '@frakt/pages/MarketsPage/components/OrderBook/types';
import { BASE_POINTS } from '@frakt/utils/bonds';

import { InitialEditValues } from './types';

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
  initialEditValues: InitialEditValues,
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

export const calculateDefaultLoanValue = (
  solanaBalance: number,
  bestOffer: number,
): string => {
  const transactionFee = 0.01;
  const balanceAfterTransactionFee = solanaBalance - transactionFee;
  const maxLoanValue =
    balanceAfterTransactionFee < 0 ? 0 : balanceAfterTransactionFee;

  const bestOfferInSol = bestOffer / 1e9 || 0;

  const defaultLoanValue = Math.min(maxLoanValue, bestOfferInSol) || 0;
  const formattedLoanValue = defaultLoanValue?.toFixed(2);

  return formattedLoanValue;
};

export const parseInitialEditValues = ({
  initialPairValues,
  marketFloor,
}: {
  initialPairValues: MarketOrder;
  marketFloor: number;
}) => {
  const { rawData } = initialPairValues;

  const loanValue = calculateLoanValue(initialPairValues, marketFloor);
  const loanAmount = rawData.fundsSolOrTokenBalance / loanValue;

  const formattedLoanAmount = (loanAmount || 0)?.toFixed(0);
  const formattedLoanValue = (loanValue / 1e9)?.toFixed(2);

  return {
    loanAmount: formattedLoanAmount,
    loanValue: formattedLoanValue,
    bondFeature: rawData?.bondFeature,
  };
};
