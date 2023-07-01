import axios from 'axios';
import { RefinanceAuctionItem } from './types';

export const fetchRefinanceAuctions = async (): Promise<
  RefinanceAuctionItem[]
> => {
  const { data } = await axios.get<RefinanceAuctionItem[]>(
    `https://${process.env.BACKEND_DOMAIN}/bonds/refinance`,
  );

  return data ?? [];
};
