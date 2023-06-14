import { web3 } from '@frakt-protocol/frakt-sdk';
import { IS_PRIVATE_MARKETS } from '@frakt/config';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import axios from 'axios';

import {
  MarketPreview,
  Market,
  Pair,
  Bond,
  FetchBondsRequestParams,
  TotalBondsStats,
  MarketHistory,
  BondHistory,
} from './types';

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

type FetchAllMarkets = () => Promise<Market[]>;
export const fetchAllMarkets: FetchAllMarkets = async () => {
  const { data } = await axios.get<Market[]>(
    `https://${BACKEND_DOMAIN}/markets?isPrivate=${IS_PRIVATE_MARKETS}`,
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
    `https://${BACKEND_DOMAIN}/markets/${marketPubkey?.toBase58()}?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data;
};

type FetchMarketsPreview = (props: {
  walletPubkey?: web3.PublicKey;
}) => Promise<MarketPreview[]>;
export const fetchMarketsPreview: FetchMarketsPreview = async ({
  walletPubkey,
}) => {
  const walletQuery = walletPubkey ? `/${walletPubkey?.toBase58()}` : '';
  const { data } = await axios.get<MarketPreview[]>(
    `https://${BACKEND_DOMAIN}/bonds/preview${walletQuery}?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data;
};

type FetchMarketPairs = (props: {
  marketPubkey: web3.PublicKey;
}) => Promise<Pair[]>;
export const fetchMarketPairs: FetchMarketPairs = async ({ marketPubkey }) => {
  const { data } = await axios.get<Pair[]>(
    `https://${BACKEND_DOMAIN}/bond-offers/${marketPubkey?.toBase58()}?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data;
  // .filter(
  //   ({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA,
  // );
};

type FetchMarketPair = (props: { pairPubkey: web3.PublicKey }) => Promise<Pair>;
export const fetchMarketPair: FetchMarketPair = async ({ pairPubkey }) => {
  const { data } = await axios.get<Pair>(
    `https://${BACKEND_DOMAIN}/bond-offer/${pairPubkey?.toBase58()}?isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data;
};

type FetchAllBonds = ({
  skip,
  limit,
  sortBy,
  order,
}: FetchBondsRequestParams) => Promise<Bond[]>;
export const fetchAllBonds: FetchAllBonds = async ({
  skip,
  limit,
  sortBy,
  order,
  walletPubkey,
  marketPubkey,
}) => {
  const marketQuery = marketPubkey ? `marketPubKey=${marketPubkey}&` : '';
  const walletQuery = walletPubkey
    ? `wallet=${walletPubkey?.toBase58()}&onlyUser=true`
    : '';

  const { data } = await axios.get<Bond[]>(
    `https://${BACKEND_DOMAIN}/bonds?sort=${order}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&${marketQuery}${walletQuery}&isPrivate=${IS_PRIVATE_MARKETS}&version=2`,
  );

  return data;
};

type FetchBondsStats = ({
  walletPubkey,
  marketPubkey,
}: {
  marketPubkey: string;
  walletPubkey: web3.PublicKey;
}) => Promise<TotalBondsStats>;
export const fetchBondsStats: FetchBondsStats = async ({
  marketPubkey,
  walletPubkey,
}) => {
  const marketQuery = marketPubkey ? `marketPubKey=${marketPubkey}&` : '';
  const walletQuery = walletPubkey ? `wallet=${walletPubkey}` : '';

  const { data } = await axios.get<TotalBondsStats>(
    `https://${BACKEND_DOMAIN}/stats/bonds?${marketQuery}${walletQuery}&isPrivate=${IS_PRIVATE_MARKETS}`,
  );

  return data;
};

type FetchBondsHistory = ({
  skip,
  limit,
  sortBy,
  order,
  eventType,
}: FetchBondsRequestParams) => Promise<BondHistory[]>;
export const fetchBondsHistory: FetchBondsHistory = async ({
  skip,
  limit,
  sortBy,
  order,
  walletPubkey,
  eventType,
  marketPubkey,
}: FetchBondsRequestParams) => {
  const marketQuery = marketPubkey ? `marketPubKey=${marketPubkey}&` : '';
  const walletQuery = walletPubkey
    ? `wallet=${walletPubkey?.toBase58()}&onlyUser=true&`
    : '';
  const eventTypeQuery = eventType ? `eventType=${eventType}` : '';

  const { data } = await axios.get<Bond[]>(
    `https://${BACKEND_DOMAIN}/bonds/history?sort=${order}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&${marketQuery}${walletQuery}${eventTypeQuery}&isPrivate=${IS_PRIVATE_MARKETS}&version=2`,
  );

  return data;
};

type FetchMarketHistory = (props: {
  marketPubkey: string;
}) => Promise<MarketHistory>;
export const fetchMarketHistory: FetchMarketHistory = async ({
  marketPubkey,
}) => {
  const { data } = await axios.get<MarketHistory>(
    `https://${BACKEND_DOMAIN}/stats/bonds/history?marketPubKey=${marketPubkey}`,
  );

  return data;
};
