import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { Market, Pair, WhitelistType } from '../bonds';
import { LoanType } from '../loans';
import { Dictionary } from 'ramda';

export interface BorrowNft {
  mint: string;
  name: string;
  collectionName: string;
  imageUrl: string;

  valuation: number; // lamports
  freezable: boolean;
  stakingAvailable: boolean;
  maxLoanValue: number; // Max borrow value that user can get across all loan type

  classicParams?: {
    isLimitExceeded: boolean;
    maxLoanValue: number; // lamports
    timeBased: {
      liquidityPoolPubkey: string;
      returnPeriodDays: number; // 14 (days)
      ltvPercent: number; // 40 (%)
      fee: number; // lamports
      feeDiscountPercent: number; // 2 (%)

      loanValue: number; // lamports
      repayValue: number; // lamports
    };
    priceBased?: {
      liquidityPoolPubkey: string;
      ltvPercent: number; // 40 (%)
      borrowAPRPercent: number; // 10 (%)
      collaterizationRate: number; // 10(%)
    };
  };

  bondParams?: {
    duration: number;
    fee: number;
    marketPubkey: string;
    whitelistEntry: {
      publicKey: string;
      fraktMarket: string;
      whitelistType: WhitelistType;
      whitelistedAddress: string;
    };
    fraktMarket: string;
    oracleFloor: string;
    durations: Array<number>; //? days
  };
}

export interface BondCartOrder {
  orderSize: number; //? lamports
  spotPrice: number; //? lamports
  pairPubkey: string;
  assetReceiver: string;
  durationFilter: number;
  bondFeature: BondFeatures;
}

export interface BorrowNftSuggested {
  loanType: LoanType;
  loanValue: number; //? lamports. Max for timeBased, selected for priceBased and Bonds

  borrowNft: BorrowNft;

  bondOrderParams?: BondCartOrder[];
}

export enum BulkTypes {
  best = 'best',
  cheapest = 'cheapest',
  safest = 'safest',
  max = 'max', //? Exists when the user wants to borrow more than he has
}

export interface Suggestion {
  orders: BorrowNftSuggested[];
  markets?: Market[];
  modifiedPairs?: Pair[];
}

export type BulkSuggestion = {
  [key in BulkTypes]?: Suggestion;
};

export type LoanDuration = '7' | '14' | '0'; //? 0 for perpetual

export interface MaxBorrow {
  '0': number;
  '7': number;
  '14': number;
  all: number;
}

export interface OrderParamsLite {
  loanValue: number;
  loanFee: number;
  orders: BondCartOrder[];
}

export interface WalletNftsLite {
  nfts: Array<BorrowNft>;
  //? Collection by marketPubkey
  orders: Dictionary<Array<OrderParamsLite>>;
}
