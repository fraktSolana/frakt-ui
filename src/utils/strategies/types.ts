import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';

export interface FormValues {
  strategyName: string;
  image: {
    file: File | null;
    imageUrl: string;
  };
  durationFilter: string;
  hadoMarkets: {
    marketName: string;
    marketPubkey: string;
  };
  loanToValueFilter: number;
  bondingType: BondingCurveType;
  spotPrice: string;
  bidCap: string;
  delta: string;
  maxTradeAmount: string;
  utilizationRate: string;
  tradeDuration: string;
  remainingSolRatioToFinishTrade: string;
  minTimeBetweenTrades: string;
}
