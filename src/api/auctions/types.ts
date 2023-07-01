import { DeltaType } from '@frakters/raffle-sdk/lib/raffle-core/types';

interface RepayAccount {
  bondTradeTransaction: string;
  bondOffer: string;
  user: string;
}

export interface RefinanceAuctionItem {
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;

  bondParams: {
    repayAccounts: RepayAccount[];
    fbondPubkey: string;
    oracleFloor: string;
    hadoMarket: string;

    floorPrice: number;
    auctionRefinanceStartTime: number;
    loanValue: number;
    repayValue: number;
  };
}

export interface AuctionItem {
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;

  classicParams?: {
    auctionPubkey: string;

    startPrice: number;
    startedAt: number;
    delta: number;
    deltaType: DeltaType;

    timeToNextRound: number;
    floorPrice: number;
    nextPrice: number;
    buyPrice: number;

    denominator: number;
  };

  bondParams?: {
    repayAccounts: RepayAccount[];
    fbondPubkey: string;
    collateralBox: string;
    collateralBoxType: string;
    collateralTokenMint: string;
    collateralTokenAccount: string;
    collateralOwner: string;
    fraktMarket: string;
    oracleFloor: string;
    whitelistEntry: string;

    floorPrice: number;
    startAuctionTime: number;
  };
}

export interface AuctionHistoryItem {
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

export type BondAuctionItem = AuctionItem;
export type ClassicAuctionItem = AuctionItem;
