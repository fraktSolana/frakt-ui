import { DEFAULT_STANDART_INTEREST } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';
import { web3 } from 'fbonds-core';
import { PUBKEY_PLACEHOLDER } from '..';

export const FRAKT_MARKET_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.FRAKT_MARKET_PROGRAM_PUBKEY || PUBKEY_PLACEHOLDER,
);

export const STANDART_LOOKUP_TABLE = new web3.PublicKey(
  process.env.LOOKUP_TABLE_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const BONDS_PROGRAM_PUBKEY = new web3.PublicKey(
  process.env.BONDS_PROGRAM_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const BONDS_ADMIN_PUBKEY = new web3.PublicKey(
  process.env.BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER,
);
export const MAX_ACCOUNTS_IN_FAST_TRACK = 33;

export const BOND_DECIMAL_DELTA = 1e4;
export const BOND_SOL_DECIMAIL_DELTA = 1e5;

export const BOND_MAX_RETURN_AMOUNT_FILTER = 1000 * 1e9; //? 1000 SOL
export const BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS = 20000; //? 200%
export const BOND_MAX_RETURN_AMOUNT_PROTECTION_LTV_MULTIPLIER = 3; //? 200%

export const BASE_POINTS = 1e4;
export const PRECISION_CORRECTION_LAMPORTS = 10000; //? 200%
export const BONDS_PROTOCOL_FEE_IN_BASE_POINTS = 50;

export const STANDART_INTEREST_PERCENT =
  (100 * (BASE_POINTS - DEFAULT_STANDART_INTEREST)) / BASE_POINTS;
