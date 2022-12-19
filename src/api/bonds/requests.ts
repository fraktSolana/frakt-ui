import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';

import { BondPreview, Market } from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DEVNET_DOMAIN; //TODO: replace to MAINNET

type FetchAllMarkets = () => Promise<Market[]>;
export const fetchAllMarkets: FetchAllMarkets = async () => {
  const { data } = await axios.get<Market[]>(
    `https://${BACKEND_DOMAIN}/markets`,
  );

  return data;
};

type FetchCertainMarket = (props: {
  marketPubkey: web3.PublicKey;
}) => Promise<Market>;
export const fetchCertainMarket: FetchCertainMarket = async ({
  marketPubkey,
}) => {
  const { data } = await axios.get<Market>(
    `https://${BACKEND_DOMAIN}/markets/${marketPubkey.toBase58()}`,
  );

  return data;
};

type FetchBondsPreview = (props: {
  walletPubkey?: web3.PublicKey;
}) => Promise<BondPreview[]>;
export const fetchBondsPreview: FetchBondsPreview = async ({
  walletPubkey,
}) => {
  const { data } = await axios.get<BondPreview[]>(
    `https://${BACKEND_DOMAIN}/bonds/preview/${walletPubkey?.toBase58() ?? ''}`,
  );

  return data;
};
