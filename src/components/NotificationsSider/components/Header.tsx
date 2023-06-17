import { FC } from 'react';

import { GoBackButton } from '@frakt/components/GoBackButton';
import { useUserNotifications } from '@frakt/hooks';
import { Settings } from '@frakt/icons';

import { ScreenType } from '../constants';
import { useNotificationsSider } from '../hooks';
import styles from '../NotificationsSider.module.scss';

export const Header: FC = () => {
  const { screenType, changeContentType } = useNotificationsSider();
  const { notifications, clearAll } = useUserNotifications();

  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        {screenType === ScreenType.SETTINGS && (
          <GoBackButton
            className={styles.goBackBtn}
            onClick={() => changeContentType(ScreenType.NOTIFICATIONS)}
          />
        )}
        <h2 className={styles.title}>
          {screenType !== ScreenType.SETTINGS
            ? 'Notifications'
            : 'Notifications settings'}
        </h2>
        {screenType === ScreenType.NOTIFICATIONS && (
          <button
            className={styles.settingsBtn}
            onClick={() => changeContentType(ScreenType.SETTINGS)}
          >
            <Settings />
          </button>
        )}
      </div>
      {screenType === ScreenType.NOTIFICATIONS && !!notifications?.length && (
        <button onClick={clearAll} className={styles.clearBtn}>
          Clear all
        </button>
      )}
    </div>
  );
};
