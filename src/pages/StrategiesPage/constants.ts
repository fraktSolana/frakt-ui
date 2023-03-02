import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';

export const defaultFormValues = {
  strategyName: '',
  image: {
    file: null,
    imageUrl: '',
  },
  hadoMarkets: {
    marketName: '',
    marketPubkey: '',
  },
  durationFilter: '7',

  loanToValueFilter: 10,
  bondingType: BondingCurveType.Linear,
  interest: '',
  bidCap: '',
  delta: '',
  utilizationRate: '',

  maxTradeAmount: '',
  tradeDuration: '',
  remainingSolRatioToFinishTrade: '',
  minTimeBetweenTrades: '',
};
