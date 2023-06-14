import { useDispatch } from 'react-redux';
import { FC, useEffect } from 'react';
import classNames from 'classnames';

import { commonActions } from '@frakt/state/common/actions';
import { isPathActive } from '@frakt/utils';
import { PATHS } from '@frakt/constants';

import { HeaderStateProvider, useHeaderState } from './headerState';
import NotificationBar from '../NotificationBar';

import styles from './styles.module.scss';

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { onContentScroll } = useHeaderState();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
  }, [dispatch]);

  const disableScrollToTop = isPathActive(location.pathname, PATHS.BONDS_LITE);

  return (
    <div
      id="app-content"
      onScroll={onContentScroll}
      className={classNames(styles.content, {
        [styles.disableScrollToTop]: disableScrollToTop,
      })}
    >
      {children}
      <NotificationBar />
    </div>
  );
};

export const AppLayout: FC<LayoutProps> = ({ children, ...props }) => (
  <HeaderStateProvider>
    <Layout {...props}>{children}</Layout>
  </HeaderStateProvider>
);
