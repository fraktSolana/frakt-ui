import { AuctionListItem } from '@frakt/api/raffle';

const parseAuctionsInfo = (auction: AuctionListItem) => {
  const { bondParams } = auction;

  const floorPrice = (bondParams?.floorPrice / 1e9)?.toFixed(3);

  return { floorPrice };
};

const checkPriceThreshold = (
  fullPrice: number,
  currentPrice: number,
): boolean => {
  const threshold = fullPrice * 0.25;
  return currentPrice < threshold;
};

export { parseAuctionsInfo, checkPriceThreshold };
