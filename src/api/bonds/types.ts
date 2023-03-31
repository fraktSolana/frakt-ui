import { web3 } from '@frakt-protocol/frakt-sdk';
import {
  BondingCurveType,
  PairAuthorityType,
  MarketState,
  MarketTrustType,
  PairTokenType,
  PairValidationType,
  PairState,
  PairType,
  CollateralBoxType,
  FraktBondState,
  BondFeatures,
  AutocompoundDeposit,
} from 'fbonds-core/lib/fbond-protocol/types';

interface FMarket {
  publicKey: string;
  authority: string;
  createdAt: string;
  isRemoved: false;
  state: 'initialized'; //TODO what's this?
  updatedAt: string;
  whitelistQuantity: number;
  hadoMarket: string;
}

export enum WhitelistType {
  NFT = 'nft',
  CREATOR = 'creator',
  MERKLE_TREE = 'merkleTree',
}

interface MarketWhitelistEntry {
  _id: string;
  publicKey: string;
  createdAt: string;
  fraktMarket: string;
  isDeployed: boolean;
  isRemoved: boolean;
  updatedAt: string;
  whitelistType: WhitelistType;
  whitelistedAddress: string;
}

interface MarketOracle {
  publicKey: string;
  fraktMarket: string;
  oracleAuthority: string;
  oracleInfo: string;
  floor: number;
  lastUpdatedAt: number;
}

export interface Market {
  marketPubkey: string;
  collectionImage: string;
  collectionName: string;
  createdAt: string;
  isRemoved: boolean;
  marketAuthority: string;
  marketDecimals: number;
  marketState: MarketState;
  marketTrustType: MarketTrustType;
  minBidCap: number;
  pairTokenMint: string;
  pairTokenType: PairTokenType;
  pairValidationType: PairValidationType;
  updatedAt: string;
  validationAdapterProgram: string;
  image: string;
  name: string;
  fraktMarket: FMarket;
  whitelistEntry: MarketWhitelistEntry;
  oracleFloor: MarketOracle;
  fbondTokenName: string;
}

export interface MarketPreview {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
  offerTVL: string;
  walletRedeemAmount?: number;
  apy: number; //? %
  duration: Array<number>; //? [7], [7, 14], [14]
  bestOffer: number; //? lamports
  bestLTV: number;
  activeBondsAmount: number;
}

export interface Pair {
  publicKey: string;
  assetReceiver: string;
  baseSpotPrice: number;
  bidCap: number;
  bidSettlement: number;
  bondingCurve: {
    delta: number;
    bondingType: BondingCurveType;
  };
  buyOrdersQuantity: number;
  concentrationIndex: number;
  createdAt: string;
  currentSpotPrice: number;
  edgeSettlement: number;
  fee: number;
  feeTokenAccount: string;
  feeVaultSeed: number;
  fundsSolOrTokenBalance: number;
  fundsSolVaultSeed: number;
  fundsTokenAccount: string;
  hadoMarket: string;
  initialFundsSolOrTokenBalance: number;
  isRemoved: boolean;
  lastTransactedAt: number;
  lpTokensInCirculation: number;
  lpTokensMint: string;
  mathCounter: number;
  nftsSeed: number;
  authorityAdapterPublicKey: string;
  pairAuthorityAdapterProgram: string;
  pairAuthorityType: PairAuthorityType;
  pairState: PairState;
  pairType: PairType;
  sellOrdersCount: number;
  solOrTokenFeeAmount: number;
  updatedAt: string;
  validation: {
    bondFeatures: BondFeatures;
    publicKey: string;
    createdAt: string;
    durationFilter: number;
    isRemoved: boolean;
    loanToValueFilter: number;
    pair: string;
    updatedAt: string;
    user: string;
  };
}

interface FBond {
  publicKey: string;
  activatedAt: number;
  liquidatingAt: number;
  actualReturnedAmount: number; //? in lamports
  amountToReturn: number;
  bondProgramAuthoritySeed: number;
  collateralBoxesQuantity: number;
  fbondIssuer: string;
  fbondTokenMint: string;
  fbondTokenSupply: number;
  fraktBondState: FraktBondState;
  isRemoved: boolean;
  redeemedAt: number;
  returnFundsOwnerSeed: number;
  returnTokenAccount: string;
  returnTokenMint: string;
  bondCollateralOrSolReceiver: string;
  fbondTokenName: string;
  marketPubkey: string;
  ltvPercent: string;
}

interface CollateralBox {
  publicKey: string;
  collateralAmount: number;
  collateralBoxType: CollateralBoxType;
  collateralTokenAccount: string;
  collateralTokenMint: string;
  fbond: string;
  isRemoved: boolean;
  nft: {
    mint: string;
    name: string;
    imageUrl: string;
  };
}

export interface BondStats {
  interest: number;
  averageBondPrice: number;
  apy: number;
  pnl: number;
  size: number;
  ltv: number;
  estProfit: number;
  expiration: number;
  state?: string;
  when?: number;
  autocompound?: string;
  received?: number;
  status?: string;
}

export interface Bond {
  fbond: FBond;
  collateralBox: CollateralBox;
  apy: number; //? Percent (50%)
  averageBondPrice: number; //? price in lamports for minimal part of bond
  interest: number; //? BasePoint percent (50% === 5000)
  amountOfUserBonds: number;
  autocompoundDeposits?: AutocompoundDeposit[];
  stats: BondStats;
}

export interface FetchBondsRequestParams {
  skip: number;
  limit: number;
  sortBy: string;
  order: string;
  walletPubkey: web3.PublicKey;
  eventType?: string;
  marketPubkey?: string;
}

export interface TotalBondsStats {
  activeLoans: number;
  tvl: number;
}

export interface MarketHistory {
  time: string;
  activeBonds: number;
  highestLTV: number;
}
