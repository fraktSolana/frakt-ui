export interface TradePools {
  publicKey: string;
  collections: string[];
  depositYield: number;
  totalLiquidity: number;
  wallet: {
    userLiquidity: number;
    userDeposit: number;
    userYield: number;
  };
}
