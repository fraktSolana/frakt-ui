export interface NFT {
  image: string;
  maxLoanValue: number;
  duration: number;
  fee: number;

  name?: string;
  mint?: string;
  marketPubkey?: string;
  activeBondsAmount?: number;
  fraktMarketPubkey?: string;
  oracleFloorPubkey?: string;
  whitelistEntryPubkey?: string;
  bestOffer?: number;
}
