import { web3 } from '@frakt-protocol/frakt-sdk';
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

export interface BondsAuctionsListItem {
  fbond: web3.PublicKey;
  collateralBox: web3.PublicKey;
  collateralTokenMint: web3.PublicKey;
  collateralTokenAccount: web3.PublicKey;
  collateralOwner: web3.PublicKey;
  fraktMarket: web3.PublicKey;
  oracleFloor: web3.PublicKey;
  whitelistEntry: web3.PublicKey;

  nft: any;
  floorPrice: number;
  startAuctionTime: number;

  repayAccounts: [
    {
      bondTradeTransaction: web3.PublicKey;
      bondOffer: web3.PublicKey;
    },
  ];
}

export interface AuctionListItem {
  bondPubKey?: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  auctionPubkey: string;
  nftMint: string;
  timeToNextRound: number;
  floorPrice: number;
  startPrice: number;
  nextPrice: number;
  buyPrice: number;

  denominator: number;
  startedAt: number;
  delta: number;
  deltaType: DeltaType;
}

export interface CollectionsListItem {
  name: string;
}

export interface LotteryTickets {
  currentTickets: number;
  totalTickets: number;
}
