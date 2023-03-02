import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';

export interface TradePool {
  collections: {
    image: string;
    name: string;
  }[];
  depositYield: number;
  isCanEdit: boolean;
  isPrivate: boolean;
  poolImage: string;
  poolName: string;
  poolPubkey: string;
  totalLiquidity: number;
  utilizationRate: number;
  wallet?: {
    userDeposit: number;
    userLiquidity: number;
    userYield: number;
  };
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
