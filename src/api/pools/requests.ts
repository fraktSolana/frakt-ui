import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';

import { LiquidityPool } from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchLiquidityPools = ({
  walletPublicKey,
  privatePoolHash,
}: {
  walletPublicKey: web3.PublicKey;
  privatePoolHash: string;
}) => Promise<LiquidityPool[]>;

export const fetchLiquidityPools: FetchLiquidityPools = async ({
  walletPublicKey,
  privatePoolHash,
}) => {
  const { data } = await axios.get<LiquidityPool[]>(
    `https://${BACKEND_DOMAIN}/liquidity/list?wallet=${walletPublicKey}&privatePoolHash=${privatePoolHash}`,
  );

  return data;
};
