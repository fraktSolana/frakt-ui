import { FC } from 'react';
import {
  useNotificationSubscriptions,
  WalletNotificationSubscription,
} from '@dialectlabs/react-sdk';
import { debounce, fromPairs, map } from 'lodash';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import Toggle from '@frakt/components/Toggle';
import {
  getUserNotificationsSettings,
  setUserNotificationsSettings,
} from '@frakt/api/user';

import styles from '../..//NotificationsSider.module.scss';
import { DIALECT_APP_PUBLIC_KEY } from '../../constants';

const useEventsSettings = () => {
  const { publicKey } = useWallet();

  //? Need to fetch settings from BE to create an instance in database
  useQuery(
    ['userNotificationsSettings', publicKey],
    () => getUserNotificationsSettings({ publicKey }),
    {
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: !!publicKey,
    },
  );

  const {
    subscriptions: notificationSubscriptions,
    update: updateNotificationSubscription,
  } = useNotificationSubscriptions({ dappAddress: DIALECT_APP_PUBLIC_KEY });

  const updateSettings = async (
    enabled: boolean,
    notificationSubscription: WalletNotificationSubscription,
  ) => {
    try {
      const { notificationType, subscription } = notificationSubscription;
      await updateNotificationSubscription({
        notificationTypeId: notificationType.id,
        config: {
          ...subscription.config,
          enabled,
        },
      });

      const settings = fromPairs(
        map(notificationSubscriptions, (notificationSubscription) => {
          const targetSetting =
            notificationSubscription.notificationType.id ===
            notificationType.id;

          const value = targetSetting
            ? enabled
            : notificationSubscription.subscription.config.enabled;

          return [
            notificationSubscription.notificationType.humanReadableId,
            value,
          ];
        }),
      );

      await setUserNotificationsSettings({
        settings,
        publicKey,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedUpdateSettings = debounce(updateSettings, 300);

  return {
    notificationSubscriptions,
    updateSettings: debouncedUpdateSettings,
  };
};

export const EventsSettings: FC = () => {
  const { notificationSubscriptions, updateSettings } = useEventsSettings();

  return (
    <div className={styles.eventsList}>
      {!!notificationSubscriptions.length &&
        notificationSubscriptions.map((notificationSubscription) => (
          <div
            key={notificationSubscription.notificationType.id}
            className={styles.eventsListRow}
          >
            <p>{notificationSubscription.notificationType.name}</p>
            <Toggle
              defaultChecked={
                notificationSubscription.subscription.config.enabled
              }
              onChange={(value) =>
                updateSettings(value, notificationSubscription)
              }
            />
          </div>
        ))}
    </div>
  );
};
