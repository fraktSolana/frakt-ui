import moment from "moment";
import {
  Adventure,
  AdventureSubscription,
  BanxStakeState,
} from "fbonds-core/lib/fbond-protocol/types";

import { AdventureNft, SubscriptionStatus } from "@frakt/api/adventures";

import { AdventureStatus } from "./types";

export const getAdventureStatus = (adventure: Adventure) => {
  const timeNowUnix = moment().unix();
  const { periodStartedAt, periodEndingAt } = adventure;

  if (timeNowUnix > periodEndingAt) return AdventureStatus.ENDED;
  if (timeNowUnix > periodStartedAt) return AdventureStatus.LIVE;
  return AdventureStatus.UPCOMING;
};

export const isNftStaked = (nft: AdventureNft) => {
  return nft?.banxStake?.banxStakeState === BanxStakeState.Staked;
};

export const calcNftsPartnerPoints = (nfts: AdventureNft[] = []) => {
  return nfts.reduce((acc, { meta }) => acc + parseInt(meta.partnerPoints.toString()), 0);
};

export const isNftParticipating = (
  nft: AdventureNft,
  adventurePubkey: string
) => {
  return !!nft?.subscriptions.find(
    (subscription) => subscription.adventure === adventurePubkey
  );
};

export const getSubscriptionStatus = (
  subscription: AdventureSubscription
): SubscriptionStatus => {
  const { unsubscribedAt, harvestedAt } = subscription;
  if (unsubscribedAt === 0 && harvestedAt === 0)
    return SubscriptionStatus.Active;
  if (harvestedAt > 0) return SubscriptionStatus.Harvested;
  return SubscriptionStatus.Unsubscribed;
};

export const isSubscriptionActive = (subscription: AdventureSubscription) =>
  getSubscriptionStatus(subscription) === SubscriptionStatus.Active;

export const isNftHasActiveSubscriptions = (nft: AdventureNft) => {
  return !!nft?.subscriptions.find(isSubscriptionActive);
};
