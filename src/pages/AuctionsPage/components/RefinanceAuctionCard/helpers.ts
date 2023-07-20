import moment from 'moment';

import { AuctionItem } from '@frakt/api/auctions';
import { convertAprToApy } from '@frakt/utils';

export const REFINANCE_START_INTEREST = 15e1;
export const REFINANCE_INTEREST_TIC = 10;
export const REFINANCE_INTEREST_REFRESH_RATE = 4320;
export const REFINANCE_MAX_INTEREST = 25e1;

const WEEKS_IN_YEAR = 52;

const parseRefinanceAuctionsInfo = (auction: AuctionItem) => {
  if (!auction?.bondParams?.auctionRefinanceStartTime) return null;

  const floorPrice = auction?.bondParams.floorPrice / 1e9;
  const totalRepayValue = auction?.bondParams.repayValue / 1e9 / 0.995;

  const graceStartTime = auction.bondParams.auctionRefinanceStartTime;

  const currentTime = moment().unix();
  const ticsPassed = Math.floor(
    (currentTime - graceStartTime) / REFINANCE_INTEREST_REFRESH_RATE,
  );
  const auctionInterest =
    REFINANCE_INTEREST_TIC * ticsPassed + REFINANCE_START_INTEREST;

  const currentInterest =
    auctionInterest > REFINANCE_MAX_INTEREST
      ? REFINANCE_MAX_INTEREST
      : auctionInterest;

  const newLoanAmount = (totalRepayValue * 0.995) / (1 - currentInterest / 1e4);

  const apy = convertAprToApy(((currentInterest / 100) * WEEKS_IN_YEAR) / 100);
  const ltv = (newLoanAmount / floorPrice) * 100;

  return {
    ticsPassed,
    currentLoanAmount: totalRepayValue,
    newLoanAmount,
    floorPrice,
    interest: newLoanAmount - totalRepayValue,
    apy,
    ltv,
  };
};

export { parseRefinanceAuctionsInfo };
