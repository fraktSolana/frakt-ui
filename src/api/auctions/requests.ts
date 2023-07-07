import axios from 'axios';
import { RefinanceAuctionItem } from './types';
import { IS_PRIVATE_MARKETS } from '@frakt/config';
import moment from 'moment';

export const fetchRefinanceAuctions = async (): Promise<
  RefinanceAuctionItem[]
> => {
  const { data } = await axios.get<RefinanceAuctionItem[]>(
    `https://${process.env.BACKEND_DOMAIN}/bonds/refinance?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  const timeNowUnix = moment().unix();
  const filtered = data?.filter(
    (loan) => loan.bondParams.auctionRefinanceStartTime + 43200 < timeNowUnix,
  );

  return filtered ?? [];
};
