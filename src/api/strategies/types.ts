import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';

export interface Settings {
  poolPubkey: string;
  name: string;
  image: string;
  secret: string;
}

export interface TradePoolUser {
  authority: string;
  balance: number;
  collections: { name: string; image: string }[];
  createdAt: string;
  currentDistributionEndTime: number;
  delta: number;
  depositYield: number;
  epoch: number;
  image: string;
  isPrivate: boolean;
  isRemoved: boolean;
  lastUpdatedAt: number;
  name: string;
  newMul: number;
  oldMul: number;
  performanceFee: number;
  publicKey: string;
  remainingLamportsToSendToAdmin: number;
  reserveFundsRatio: number;
  step: number;
  totalLiquidity: number;
  tradeAuthority: string;
  tradePoolType: string;
  updatedAt: string;
  wallet?: {
    userDeposit: number;
    userLiquidity: number;
    userYield: number;
  };
}

export interface TradePoolAdmin {
  authority: string;
  balance: number;
  collections: { name: string; image: string }[];
  createdAt: string;
  currentDistributionEndTime: number;
  delta: number;
  depositYield: number;
  epoch: number;
  image: string;
  isPrivate: boolean;
  isRemoved: boolean;
  lastUpdatedAt: number;
  name: string;
  newMul: number;
  oldMul: number;
  performanceFee: number;
  publicKey: string;
  remainingLamportsToSendToAdmin: number;
  reserveFundsRatio: number;
  step: number;
  totalLiquidity: number;
  tradeAuthority: string;
  tradePoolType: string;
  updatedAt: string;
  settings?: {
    bidCap: number;
    bondingType: BondingCurveType;
    delta: number;
    durationFilter: number;
    hadoMarket: string;
    lastTradeStartTime: number;
    loanToValueFilter: number;
    maxTradeAmount: number;
    minTimeBetweenTrades: number;
    publicKey: string;
    remainingSolRatioToFinishTrade: number;
    spotPrice: number;
    strategyNum: number;
    tradeAmountRatio: number;
    tradeDuration: number;
  };
}

export interface TradePoolStats {
  userTotalLiquidity: number;
  userWeightedAPY: number;
}
