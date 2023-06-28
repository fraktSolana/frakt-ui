import { web3 } from '@frakt-protocol/frakt-sdk';
import axios from 'axios';
import { Dictionary } from 'lodash';

import { getDiscordAvatarUrl } from '@frakt/utils';

import {
  UserInfo,
  UserInfoRaw,
  Notification,
  UserStats,
  UserRewards,
  CollectionsStats,
  AvailableToBorrowUser,
  LeaderBoard,
} from './types';

type FetchUser = (props: {
  publicKey: web3.PublicKey;
}) => Promise<UserInfo | null>;
export const fetchUser: FetchUser = async ({ publicKey }) => {
  try {
    const { data } = await axios.get<UserInfoRaw>(
      `https://${process.env.BACKEND_DOMAIN}/user/${publicKey.toBase58()}`,
    );

    if (!data) return null;

    const avatarUrl = getDiscordAvatarUrl(data.discordId, data.avatar);

    const { data: avatarExists } = await axios
      .get<string>(avatarUrl)
      .catch((error) => error);

    return {
      avatarUrl: avatarExists ? avatarUrl : null,
      isOnServer: data.isOnServer,
    };
  } catch (error) {
    return null;
  }
};

type RemoveUser = (props: { publicKey: web3.PublicKey }) => Promise<void>;
export const removeUser: RemoveUser = async ({ publicKey }) => {
  try {
    await axios.get(
      `https://${
        process.env.BACKEND_DOMAIN
      }/user/${publicKey.toBase58()}/delete`,
    );
  } catch (error) {
    return null;
  }
};

type GetUserNotifications = (props: {
  publicKey: web3.PublicKey;
}) => Promise<ReadonlyArray<Notification>>;
export const getUserNotifications: GetUserNotifications = async ({
  publicKey,
}) => {
  try {
    const { data } = await axios.get<ReadonlyArray<Notification>>(
      `https://${process.env.BACKEND_DOMAIN}/history/${publicKey.toBase58()}`,
    );

    return data ?? [];
  } catch (error) {
    return [];
  }
};

type MarkNotificationsAsRead = (props: {
  publicKey: web3.PublicKey;
  notificationIds: string[];
}) => Promise<void>;
export const markNotificationsAsRead: MarkNotificationsAsRead = async ({
  publicKey,
  notificationIds,
}) => {
  await axios.post(
    `https://${process.env.BACKEND_DOMAIN}/history/${publicKey.toBase58()}`,
    {
      ids: notificationIds,
    },
  );
};

type DeleteNotifications = (props: {
  publicKey: web3.PublicKey;
  notificationIds: string[];
}) => Promise<void>;
export const deleteNotifications: DeleteNotifications = async ({
  publicKey,
  notificationIds,
}) => {
  await axios.post(
    `https://${
      process.env.BACKEND_DOMAIN
    }/history/${publicKey.toBase58()}/delete`,
    {
      ids: notificationIds,
    },
  );
};

type GetUserNotificationsSettings = (props: {
  publicKey: web3.PublicKey;
}) => Promise<Dictionary<boolean>>;
export const getUserNotificationsSettings: GetUserNotificationsSettings =
  async ({ publicKey }) => {
    const { data } = await axios.get<Dictionary<boolean>>(
      `https://${process.env.BACKEND_DOMAIN}/settings/${publicKey.toBase58()}`,
    );

    return data;
  };

type SetUserNotificationsSettings = (props: {
  publicKey: web3.PublicKey;
  settings: Dictionary<boolean>;
}) => Promise<void>;
export const setUserNotificationsSettings: SetUserNotificationsSettings =
  async ({ publicKey, settings }) => {
    await axios.post(
      `https://${process.env.BACKEND_DOMAIN}/settings/${publicKey.toBase58()}`,
      settings,
    );
  };

type FetchAvailableToBorrowUser = (props: {
  publicKey: web3.PublicKey;
}) => Promise<AvailableToBorrowUser>;
export const fetchAvailableToBorrowUser: FetchAvailableToBorrowUser = async ({
  publicKey,
}) => {
  const { data } = await axios.get<AvailableToBorrowUser>(
    `https://${process.env.BACKEND_DOMAIN}/nft/available-to-borrow/${
      publicKey?.toBase58() || ''
    }`,
  );

  return data;
};

type FetchCollectionsStats = () => Promise<CollectionsStats>;
export const fetchCollectionsStats: FetchCollectionsStats = async () => {
  const { data } = await axios.get<CollectionsStats>(
    `https://${process.env.BACKEND_DOMAIN}/stats/available-to-borrow`,
  );

  return data;
};

type FetchAllUserStats = (props: {
  publicKey: web3.PublicKey;
}) => Promise<UserStats>;
export const fetchAllUserStats: FetchAllUserStats = async ({ publicKey }) => {
  const { data } = await axios.get<UserStats>(
    `https://${process.env.BACKEND_DOMAIN}/stats/all/${
      publicKey?.toBase58() || ''
    }`,
  );

  return data;
};

type FetchUserRewards = (props: {
  publicKey: web3.PublicKey;
}) => Promise<UserRewards>;
export const fetchUserRewards: FetchUserRewards = async ({ publicKey }) => {
  const { data } = await axios.get<UserRewards>(
    `${process.env.REWARDS_ENDPOINT}/${publicKey?.toBase58() || ''}`,
  );

  return data;
};

export const fetchUserIndividual = async (
  publicKey: string,
): Promise<LeaderBoard> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/leaderboard?sort=asc&skip=0&limit=10&search=${publicKey}&sortBy=rank`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data?.[0];
};

type SignIn = (params: {
  publicKey: web3.PublicKey;
  signature: string;
}) => Promise<string | null>;
export const signIn: SignIn = async ({ publicKey, signature }) => {
  const { data } = await axios.post<{ access_token: string }>(
    `https://${process.env.BACKEND_DOMAIN}/auth/sign-in`,
    {
      publicKey,
      signature,
    },
  );

  return data?.access_token || null;
};

//TODO Not implemented on BE yet. Use instead of manual expiration check of access token
type CheckAccessToken = (token: string) => Promise<boolean>;
export const checkAccessToken: CheckAccessToken = async (token) => {
  const { data } = await axios.post<{ token_valid: boolean }>(
    `https://${process.env.BACKEND_DOMAIN}/auth/validate-token`,
    {
      token,
    },
  );

  return data?.token_valid || false;
};
