import axios from 'axios';
import { RefinanceAuctionListItem } from './types';

export const fetchRefinanceAuctions = async (): Promise<
  RefinanceAuctionListItem[]
> => {
  const { data } = await axios.get<RefinanceAuctionListItem[]>(
    `https://${process.env.BACKEND_DOMAIN}/bonds/refinance`,
  );

  return data ?? [];
};
