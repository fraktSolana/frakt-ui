import {
  Adventure,
  AdventureSubscription,
  BanxStake,
  BanxUser,
} from 'fbonds-core/lib/fbond-protocol/types';

//? adventures/?userPubkey
export interface AdventuresInfo {
  adventures: Adventure[];
  banxUser?: BanxUser | null; //? if userPubkey exists
  nfts?: AdventureNft[]; //? if userPubkey exists
}

export interface AdventureNft {
  mint: string;
  meta: {
    mint: string;
    name: string;
    imageUrl: string;
    rarity: BanxTier;
    partnerPoints: number;
    playerPoints: number;
  };
  banxStake: BanxStake | null;
  subscriptions: AdventureSubscription[];
}

export enum BanxTier {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
}

export enum SubscriptionStatus {
  Active = 'active',
  Unsubscribed = 'unsubscribed',
  Harvested = 'harvested',
}
