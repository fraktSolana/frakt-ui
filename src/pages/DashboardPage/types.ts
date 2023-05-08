export interface NFT {
  image: string;
  maxLoanValue: number;
  duration: number;
  fee: number;

  name?: string;
  mint?: string;
  marketPubkey?: string;
}
