import { groupWith } from '@frakt/utils';

import { calculateLoanValue } from '../PlaceOfferTab';
import { MarketOrder } from './types';

export const groupOffers = (
  offers: MarketOrder[],
  isOwnOrder: (order: MarketOrder) => boolean,
) => {
  const groupedOffers = groupWith(
    offers,
    (offerA: MarketOrder, offerB: MarketOrder) =>
      offerA.interest === offerB.interest &&
      offerA.ltv === offerB.ltv &&
      !isOwnOrder(offerA) &&
      !isOwnOrder(offerB),
  );

  const squashedOffers = groupedOffers.map((squashedOffers) =>
    squashedOffers.reduce((accOffer: MarketOrder, offer: MarketOrder) => ({
      ...accOffer,
      size: accOffer.size + offer.size,
    })),
  );

  return squashedOffers;
};

export const getNormalizedLoanValue = (
  offer: MarketOrder,
  marketFloor: number,
) => {
  const { synthetic, loanValue } = offer;

  const loanValueLamports = loanValue * 1e9;

  return synthetic ? loanValueLamports : calculateLoanValue(offer, marketFloor);
};

export const getNormalizedLoanAmount = (
  offer: MarketOrder,
  loanValue: number,
) => {
  const { synthetic, rawData, loanAmount } = offer;

  const roundedLoanAmount = Math.round(
    rawData?.fundsSolOrTokenBalance / loanValue,
  );

  return synthetic ? loanAmount : roundedLoanAmount;
};

export const getBestOffer = (
  offers: MarketOrder[],
  marketFloor: number,
): MarketOrder | null => {
  const validOffers = offers.map((offer) => {
    if (offer?.synthetic) return null;

    const loanValue = getNormalizedLoanValue(offer, marketFloor);
    const loanAmount = getNormalizedLoanAmount(offer, loanValue);

    return { ...offer, loanAmount };
  });

  const bestOffer = validOffers.find((offer) => offer?.loanAmount >= 1);

  return bestOffer;
};
