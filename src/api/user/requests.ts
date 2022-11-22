import { web3 } from '@frakt-protocol/frakt-sdk';
import { getDiscordAvatarUrl } from '@frakt/utils';
import axios from 'axios';
import { UserInfo, UserInfoRaw } from './types';

type FetchUser = (props: {
  publicKey: web3.PublicKey;
}) => Promise<UserInfo | null>;

export const fetchUser: FetchUser = async ({ publicKey }) => {
  const { data } = await axios.get<UserInfoRaw>(
    `https://${process.env.BACKEND_DOMAIN}/user/${publicKey.toBase58()}`,
  );

  if (!data) return null;

  return {
    avatarUrl: getDiscordAvatarUrl(data.discordId, data.avatar),
    isOnServer: data.isOnServer,
  };
};

type RemoveUser = (props: { publicKey: web3.PublicKey }) => Promise<void>;

export const removeUser: RemoveUser = async ({ publicKey }) => {
  await axios.get(
    `https://${process.env.BACKEND_DOMAIN}/user/${publicKey.toBase58()}/delete`,
  );
};
