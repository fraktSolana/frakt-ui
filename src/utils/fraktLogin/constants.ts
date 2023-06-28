import { web3 } from 'fbonds-core';

export const AUTH_MESSAGE = 'Hello! Please sign this message to proceed!';

export const MEMO_PROGRAM_ID = new web3.PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
);

export const FRAKT_LOGIN_DATA_LS_KEY = '@frakt.loginData';

export const ACCESS_TOKEN_LIFE_TIME = 24 * 60 * 60; //? 1 day
