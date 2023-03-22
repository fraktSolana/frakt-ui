export interface MarketOrder {
  ltv: number;
  size: number;
  interest: number;
  synthetic?: boolean;
  duration: number;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
  };
}

export interface SyntheticParams {
  ltv: number;
  interest: number;
  offerSize: number;
  durationDays: number;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
