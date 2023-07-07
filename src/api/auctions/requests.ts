import axios from 'axios';
import { AuctionItem } from './types';
import { IS_PRIVATE_MARKETS } from '@frakt/config';
import moment from 'moment';

export const fetchAllAuctions = async (): Promise<AuctionItem[]> => {
  const { data } = await axios.get<AuctionItem[]>(
    `https://${process.env.BACKEND_DOMAIN}/liquidation/auctions?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  const timeNowUnix = moment().unix();
  const filtered = data?.filter(
    (loan) => loan.bondParams.auctionRefinanceStartTime + 43200 < timeNowUnix,
  );

  return filtered ?? [];
};
