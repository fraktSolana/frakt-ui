import tokens from './tokens.json';
import { formatNumber } from './external/utils/utils';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

export const DECIMALS_PER_FRKT = 1e8;

export const frktBNToString = (bn: BN): string => {
  const bnStr = bn.toString(10);
  if (bnStr === '0') return '0';
  const integerPart = bnStr.slice(0, -8);
  const floatPart = bnStr.padStart(8, '0').slice(-8, -2);
  return `${integerPart || 0}.${floatPart || 0}`;
};

export const getFrktBalanceValue = (balance: BN): string => {
  const frktBalance = balance ? frktBNToString(balance) : '0';
  return `${frktBalance !== '0' ? frktBalance : '--'}`;
};

export const getSolBalanceValue = (account: AccountInfo<Buffer>): string =>
  `${formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)}`;

export interface Token {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  extensions: {
    coingeckoId: string;
  };
}

//eslint-disable-next-line
export const getTokensList = () => {
  return tokens.spl;
};

export const DEFAULT_TOKEN = tokens.spl[Object.keys(tokens.spl)[0]];

export const getTokenImageUrl = (mint: string): string => {
  return `https://sdk.raydium.io/icons/${mint}.png`;
};
