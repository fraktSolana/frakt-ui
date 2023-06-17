import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Button from '@frakt/components/Button';
import { UserAvatar } from '@frakt/components/UserAvatar';
import { useUserInfo } from '@frakt/hooks';
import { Alert } from '@frakt/icons';
import { getDiscordUri } from '@frakt/utils';
import { shortenAddress } from '@frakt/utils/solanaUtils';

import styles from '../..//NotificationsSider.module.scss';

export const DiscordSettings: FC = () => {
  const { publicKey } = useWallet();
  const { data, isDiscordConnected, removeUserInfo } = useUserInfo();

  const linkButtonHanlder = async () => {
    if (isDiscordConnected) {
      await removeUserInfo();
      return;
    }

    window.location.href = getDiscordUri(publicKey);
  };

  return (
    <div className={styles.addressSettings}>
      <p className={styles.addressSettingsLabel}>Discord</p>
      <div className={styles.discordSettings}>
        <UserAvatar
          className={styles.discordSettingsAvatar}
          imageUrl={data?.avatarUrl}
        />
        <div className={styles.discordSettingsUserInfo}>
          <p className={styles.discordSettingsUserName}>
            {data ? shortenAddress(publicKey.toBase58()) : 'Username'}
          </p>
          <Button
            className={styles.discordSettingsBtn}
            onClick={linkButtonHanlder}
          >
            {isDiscordConnected ? 'Unlink' : 'Link'}
          </Button>
        </div>
      </div>
      <div className={styles.discordAlert}>
        <Alert />
        <p>
          Please note that you should be a member of our{' '}
          <a
            href={process.env.FRAKT_DISCORD_SERVER}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.discordLink}
          >
            server
          </a>{' '}
          to receive notifications
        </p>
      </div>
    </div>
  );
};
