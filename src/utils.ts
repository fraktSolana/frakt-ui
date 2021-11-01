import tokens from './tokens.json';

export interface Token {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  extensions: {
    coingeckoId: string;
  };
}

export const getTokensList = () => {
  //eslint-disable-line
  return tokens.spl;
};

export const DEFAULT_TOKEN = tokens.spl[Object.keys(tokens.spl)[0]];

export const getTokenImageUrl = (mint: string): string => {
  return `https://sdk.raydium.io/icons/${mint}.png`;
};
