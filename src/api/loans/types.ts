import { web3 } from '@frakt-protocol/frakt-sdk';
import { BondTradeTransactionV2 } from 'fbonds-core/lib/fbond-protocol/types';

export enum LoanType {
  TIME_BASED = 'timeBased',
  PRICE_BASED = 'priceBased',
  BOND = 'bond',
}

export enum RewardState {
  STAKED = 'staked',
  UNSTAKED = 'unstaked',
}

export interface Loan {
  pubkey: string;
  loanType: LoanType;

  loanValue: number; //? Lamports
  repayValue: number; //? Lamports

  startedAt: number; //? unix timestamp

  gracePeriod?: {
    startedAt: number; //? unix timestamp
    expiredAt: number; //? unix timestamp
    liquidationLot?: string; //? For classic loans only
  };

  isGracePeriod?: boolean; //? appeared after local mapping

  nft: {
    mint: string;
    name: string;
    collectionName: string;
    collectionImage: string;
    imageUrl: string;
  };

  classicParams?: {
    nftUserTokenAccount: string;
    liquidityPool: string;
    collectionInfo: string;
    royaltyAddress: string;

    timeBased?: {
      expiredAt: number; //? unix timestamp
    };

    priceBased?: {
      nftOriginalPrice: number; //? Lamports
      liquidationPrice: number; //? Lamports
      health: number; //? 80(%) 0-100%
      borrowAPRPercent: number; //? 80(%) 0-100%
    };

    rewards?: {
      stakeState: RewardState;
      amount: number; //? Lamports
      token: string;
    };
  };

  bondParams?: {
    marketPubkey: string;
    bondTokenMint: string;
    banxStake?: string;

    collateralOrSolReceiver: string;
    collateralTokenAccount: string;
    expiredAt: number; //? unix timestamp
    activeTrades: BondTradeTransactionV2[];
  };

  cnftParams?: {
    dataHash: string;
    creatorHash: string;
    leafId: number;
    tree: string;
  };
}

export interface LoansHistory {
  nftName: string;
  nftImage: string;
  loanValue: number;
  repayValue: number;
  status: string;
  when: number;
  loanType: LoanType;
}

export interface FetchLoansHistoryParams {
  walletPubkey: web3.PublicKey;
  skip: number;
  limit: number;
  sortBy: string;
  direction: string;
  querySearch: string;
}
