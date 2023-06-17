import { forwardRef } from 'react';
import classNames from 'classnames';
import { useDialectSdk } from '@dialectlabs/react-sdk';

import { ScreenType } from './constants';
import { useNotificationsSider } from './hooks';
import { Header } from './components/Header';
import {
  SettingsScreen,
  LoadingScreen,
  SignMessageScreen,
  NotificationsScreen,
} from './screens';
import styles from './NotificationsSider.module.scss';

export const NotificationsSider = forwardRef<HTMLDivElement>((props, ref) => {
  const sdk = useDialectSdk(true);

  const { isVisible, screenType } = useNotificationsSider();

  //? Check if sdk exists to avoid "sdk is not initialized" error
  return sdk ? (
    <div
      onClick={(event) => event}
      className={classNames(styles.root, { [styles.rootHidden]: !isVisible })}
      ref={ref}
    >
      <Header />
      <>
        {screenType === ScreenType.SETTINGS && <SettingsScreen />}
        {screenType === ScreenType.LOADING && <LoadingScreen />}
        {screenType === ScreenType.SIGN_MESSAGE && <SignMessageScreen />}
        {screenType === ScreenType.NOTIFICATIONS && <NotificationsScreen />}
      </>
    </div>
  ) : (
    <></>
  );
});

NotificationsSider.displayName = 'NotificationsSider';
