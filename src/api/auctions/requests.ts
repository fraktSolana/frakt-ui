import axios from 'axios';
import { RefinanceAuctionItem } from './types';
import { IS_PRIVATE_MARKETS } from '@frakt/config';

export const fetchRefinanceAuctions = async (): Promise<
  RefinanceAuctionItem[]
> => {
  const { data } = await axios.get<RefinanceAuctionItem[]>(
    `https://${process.env.BACKEND_DOMAIN}/bonds/refinance?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data ?? [];
};
