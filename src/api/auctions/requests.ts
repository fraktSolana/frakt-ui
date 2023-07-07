import axios from 'axios';
import { AuctionItem } from './types';
import { IS_PRIVATE_MARKETS } from '@frakt/config';

export const fetchAllAuctions = async (): Promise<AuctionItem[]> => {
  const { data } = await axios.get<AuctionItem[]>(
    `https://${process.env.BACKEND_DOMAIN}/liquidation/auctions?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data ?? [];
};
