export interface FraktLoginData {
  signature: string;
  token: string;
  tokenExpiredAt: number; //? unix timestamp
  walletPubkey: string;
}
