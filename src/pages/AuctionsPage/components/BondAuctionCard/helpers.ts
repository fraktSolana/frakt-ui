import { AuctionItem } from '@frakt/api/auctions';

const parseAuctionsInfo = (auction: AuctionItem) => {
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
