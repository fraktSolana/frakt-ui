import { AuctionItem } from '@frakt/api/auctions';

export const parseAuctionsInfo = (auction: AuctionItem) => {
  const { bondParams } = auction;

  const floorPrice = (bondParams?.floorPrice / 1e9)?.toFixed(3);

  return { floorPrice };
};
