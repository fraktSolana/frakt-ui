import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

export interface MarketOrder {
  ltv: number;
  size: number;
  interest: number;
  synthetic?: boolean;
  duration: number;
  loanValue?: number;
  loanAmount?: number;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
    bondFeature?: BondFeatures;
    maxReturnAmountFilter?: number;
    fundsSolOrTokenBalance?: number;
    loanToValueFilter?: number;
  };
}

export interface SyntheticParams {
  ltv: number;
  interest: number;
  offerSize: number;
  durationDays: number;
  loanValue?: number;
  loanAmount?: number;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
