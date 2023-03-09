import { web3 } from 'fbonds-core';
import { PUBKEY_PLACEHOLDER } from '..';

export const FRAKT_TRADE_AUTHORITY = new web3.PublicKey(
  process.env.FRAKT_TRADE_AUTHORITY || PUBKEY_PLACEHOLDER,
);

export const FRAKT_TRADE_PROGRAM_ID = new web3.PublicKey(
  process.env.FRAKT_TRADE_PROGRAM_ID || PUBKEY_PLACEHOLDER,
);
