import { FC } from 'react';
import classNames from 'classnames';

import { TelegramSettings } from './TelegramSettings';
import { EmailSettings } from './EmailSettings';
import { SmsSettings } from './SmsSettings';
import { DiscordSettings } from './DiscordSettings';
import { EventsSettings } from './EventsSettings';
import styles from '../../NotificationsSider.module.scss';
import { LoadingScreen } from '../LoadingScreen';
import { useDialectSettingsLoading } from './hooks';

export const SettingsScreen: FC = () => {
  const isLoading = useDialectSettingsLoading();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={classNames(styles.content)}>
      <h2 className={styles.contentTitle}>Channels</h2>
      <div className={styles.channels}>
        <DiscordSettings />
        <EmailSettings />
        <SmsSettings />
        <TelegramSettings />
      </div>

      <h2
        className={classNames(
          styles.contentTitle,
          styles.contentTitleOffsetTop,
        )}
      >
        Events
      </h2>
      <EventsSettings />
    </div>
  );
};
