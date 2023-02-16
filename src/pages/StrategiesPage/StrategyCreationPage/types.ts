import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';

export interface FormValues {
  strategyName: string;
  imageUrl: string;
  duration: string;
  selectedMarket: {
    marketName: string;
    marketPubkey: string;
  };
  maxLTV: number;
  bondingCurve: BondingCurveType;
  spotPrice: string;
  bidCap: string;
  delta: string;
  maxTradeAmount: string;
  utilizationRate: string;
  tradeDuration: string;
  tradeAmountRatio: string;
  minTimeBetweenTrades: string;
}
