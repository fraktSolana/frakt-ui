export interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508
  maxLoanValue: string; // 1.003
  isCanFreeze: boolean;
  timeBased: {
    returnPeriodDays: number; // 14
    ltvPercents: number; // 40
    fee: string; // 0.100
    feeDiscountPercents: string; // 2
    repayValue: string; // 1.101
    liquidityPoolPubkey: string;
    loanValue: string; // 1.020
    isCanStake: boolean;
  };
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number; // 40
    borrowAPRPercents: number; // 10
    collaterizationRate: number; // 10(%)
    isCanStake: boolean;
  };
}

export interface LiquidityPool {
  pubkey: string;
  isPriceBased: boolean;
  name: string;
  imageUrl: string[];

  totalLiquidity: number;
  totalBorrowed: number;

  utilizationRate: number;
  depositApr: number;
  borrowApr?: number;

  activeloansAmount: number;

  collectionsAmount: number;

  userDeposit?: {
    pubkey: string;
    harvestAmount: number;
    depositAmount: number;
    depositAmountLamports: string; //? Lamports
  };
  userActiveLoansAmount?: number;
}

export interface Loan {
  pubkey: string;
  mint: string;
  name: string;
  collectionName: string;
  imageUrl: string;
  isPriceBased: boolean;

  loanValue: number; //? SOL
  repayValue: number; //? SOL
  repayValueLamports: string; //? Lamports

  startedAt: string; //? Date
  expiredAt?: string; //? Date
  isGracePeriod?: boolean;

  liquidationLot?: string; //? For GracePeriod loans only

  liquidityPool: string;
  collectionInfo: string;
  royaltyAddress: string;

  liquidationPrice?: number; //? 1.23456 (SOL)
  realLiquidationPrice?: number;
  valuation?: number; //? 1.23456 (SOL)
  health?: number; //? 80(%) 0-100%
  nftOriginalPrice?: number;
  borrowAPRPercents?: number;

  reward?: {
    stakeState: string;
    stakeType: string;
    dataA: string;
    dataB: string;
    dataC: string;
    dataD: string;
    amount: number;
    token: string;
    creatorWhiteListProof: string;
  };
}
