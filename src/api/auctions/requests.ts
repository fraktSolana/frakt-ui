import axios from 'axios';

export const fetchRefinanceAuctions = async (): Promise<any[]> => {
  const { data } = await axios.get<any[]>(
    `https://${process.env.BACKEND_DOMAIN}/auctions`,
  );

  return data ?? [];
};
