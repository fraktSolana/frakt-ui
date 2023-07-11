import axios from 'axios';
import { web3 } from 'fbonds-core';

import { AdventuresInfo, BanxStats } from './types';

type FetchAdventuresInfo = (props: {
  publicKey?: web3.PublicKey;
}) => Promise<AdventuresInfo | null>;
export const fetchAdventuresInfo: FetchAdventuresInfo = async ({
  publicKey,
}) => {
  try {
    const walletQuery = publicKey ? `?wallet=${publicKey.toBase58()}` : '';

    const { data } = await axios.get<AdventuresInfo>(
      `https://${process.env.BACKEND_DOMAIN}/banx/adventures${walletQuery}`,
    );

    return (
      data ?? {
        adventures: [],
      }
    );
  } catch (error) {
    return null;
  }
};

type FetchBanxStats = () => Promise<BanxStats>;
export const fetchBanxStats: FetchBanxStats = async () => {
  const DEFAULT_DATA = {
    totalRevealed: 0,
    totalPartnerPoints: 0,
  };

  try {
    const { data } = await axios.get<BanxStats>(
      `https://${process.env.BACKEND_DOMAIN}/stats/banx`,
    );

    return data ?? DEFAULT_DATA;
  } catch (error) {
    return DEFAULT_DATA;
  }
};
