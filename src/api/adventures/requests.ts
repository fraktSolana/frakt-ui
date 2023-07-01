import axios from 'axios';
import { web3 } from 'fbonds-core';

import { AdventuresInfo } from './types';

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
