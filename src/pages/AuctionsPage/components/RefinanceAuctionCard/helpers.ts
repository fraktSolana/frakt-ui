import moment from 'moment';

import { RefinanceAuctionItem } from '@frakt/api/auctions';

export const REFINANCE_START_INTEREST = 5e1;
export const REFINANCE_INTEREST_TIC = 10;
export const REFINANCE_INTEREST_REFRESH_RATE = 960;
export const REFINANCE_MAX_INTEREST = 5e2;

const parseRefinanceAuctionsInfo = (auction: RefinanceAuctionItem) => {
  const floorPrice = (auction?.bondParams.floorPrice / 1e9)?.toFixed(3);
  const totalRepayValue = auction?.bondParams.repayValue / 1e9 / 0.995;
  const currentLoanAmount = totalRepayValue?.toFixed(3);

  const currentTime = moment().unix();
  const ticsPassed =
    (currentTime - auction.bondParams.auctionRefinanceStartTime) /
    REFINANCE_INTEREST_REFRESH_RATE;
  const auctionInterest =
    REFINANCE_INTEREST_TIC * ticsPassed + REFINANCE_START_INTEREST;
  const currentInterest =
    auctionInterest > REFINANCE_MAX_INTEREST
      ? REFINANCE_MAX_INTEREST
      : auctionInterest;

  const newLoanAmount = totalRepayValue * (100 / currentInterest + 1);

  return {
    currentLoanAmount,
    newLoanAmount,
    floorPrice,
  };
};

export { parseRefinanceAuctionsInfo };
