export interface UserInfoRaw {
  avatar: string;
  discordId: string;
  isOnServer: boolean;
}

export interface UserInfo {
  avatarUrl: string;
  isOnServer: boolean;
}

export enum NotificationType {
  LOAN = 'loan',
  DEPOSIT = 'deposit',
  LOT_TICKET = 'lotTicket',
  GRACE = 'grace',
}

export interface Notification {
  id: string;
  type: NotificationType;
  user: string;
  message: {
    title: string;
    body: string;
  };
  image?: string;
  isRead: boolean;
  date: number;
}

export interface UserStats {
  bonds: BondsUserStats;
  totalStats: TotalStats;
  dailyActivity: DailyActivity;
  lastLoans: LastLoans[];
  lendingPools: LedningPools[];
}

export interface BondsUserStats {
  activeUserLoans: number;
  bondUserAmount: number;
  userOffers: number;
  userOffersAmount: number;
}

export interface TotalStats {
  lockedNftsInPools: number;
  poolsTvl: number;
  poolsVolumeAllTime: number;
  totalIssued: number;
  loansTvl: number;
  loansVolumeAllTime: number;
  activeLoansCount: number;
}

export interface DailyActivity {
  lockedNftsInLoans: number;
  issuedIn24Hours: number;
  paidBackIn24Hours: number;
  liquidatedIn24Hours: number;
  dailyVolume: number;
}

export interface LastLoans {
  image: string;
  loanValue: number;
  nftName: string;
}

export interface LedningPools {
  collectionsCount?: number;
  apr: number;
  image: string;
  nftName: string;
  tvl: number;
}

export interface UserRewards {
  lenders: Rewards[];
  borrowers: Rewards[];
}

interface Rewards {
  user: string;
  reward: number;
}

export interface CollectionsStats {
  totalLiquidity: number;
  collections: number;
}

export interface AvailableToBorrowUser {
  maxBorrow: number;
  totalUserNfts: number;
}

export interface LeaderBoard {
  deposited: number;
  interest: number;
  lent: number;
  loyaltyBoost: number;
  pfpImage: string | null;
  points: number;
  rank: number;
  teamName: string;
  wallet: string;
}
