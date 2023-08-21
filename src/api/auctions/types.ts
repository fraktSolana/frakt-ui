import { DeltaType } from '@frakters/raffle-sdk/lib/raffle-core/types';
import { CnftParams } from 'fbonds-core/lib/fbond-protocol/functions/bond/creation/createBondAndSellToOffersCnft';
import {
  AdventureSubscription,
  BanxStake,
} from 'fbonds-core/lib/fbond-protocol/types';

interface RepayAccount {
  bondTradeTransaction: string;
  bondOffer: string;
  user: string;
}

export interface AuctionItem {
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;

  cnftParams?: CnftParams;
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
    fbondPubkey: string;
    floorPrice: number;
    oracleFloor: string;
    repayAccounts: RepayAccount[];

    //? bonds auction params
    collateralBox?: string;
    collateralBoxType?: string;
    collateralTokenMint?: string;
    collateralTokenAccount?: string;
    collateralOwner?: string;
    fraktMarket?: string;
    whitelistEntry?: string;
    startAuctionTime?: number;

    //? refinace auction params
    auctionRefinanceStartTime?: number;
    loanValue?: number;
    repayValue?: number;
    hadoMarket?: string;
  };
  banxStake: BanxStake;
  adventureStakes: AdventureSubscription[];
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
