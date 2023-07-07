import { DeltaType } from '@frakters/raffle-sdk/lib/raffle-core/types';

export interface FetchItemsParams {
  sortBy?: string;
  sort?: string;
  search?: string;
  collections?: string;
  user?: string;
}

export interface RaffleListItem {
  isParticipationExists: boolean;
  rafflePubKey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  nftFloorPrice: number; //? 1.23 (SOL)
  liquidationPrice: number; //? 1.23 (SOL)
  liquidationPriceBN: string;
  tickets: number;
  expiredAt: string;
  totalTickets: number;
}

export interface GraceListItem {
  pubkey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  isPriceBased: boolean;
  loanValue: number;
  liquidationPrice: number;
  liquidationPriceLamports: string;
  valuation: number;
  startedAt: string;
  expiredAt: string;
}

export interface WonRaffleListItem {
  rafflePubKey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  nftFloorPrice: number; //? 1.23 (SOL)
  liquidationPrice: number; //? 1.23 (SOL)
  liquidationPriceBN: string;
  user: string;
  expiredAt: string;
  startedAt: string;
  totalTickets: number;
  winnerTickets: number;
  isAuction?: boolean;
}

export interface CollectionsListItem {
  name: string;
}

export interface LotteryTickets {
  currentTickets: number;
  totalTickets: number;
}
