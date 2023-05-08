export interface NFT {
  image: string;
  maxLoanValue: number;
  duration: number;
  fee: number;

  mint?: string;
  marketPubkey?: string;
}
