import { FC, useEffect } from 'react';

import { useWalletModal } from '@frakt/components/WalletModal';

import { HeaderStateProvider, useHeaderState } from './headerState';

import styles from './styles.module.scss';

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { onContentScroll } = useHeaderState();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <div id="app-content" onScroll={onContentScroll} className={styles.content}>
      {children}
    </div>
  );
};

export const AppLayout: FC<LayoutProps> = ({ children, ...props }) => (
  <HeaderStateProvider>
    <Layout {...props}>{children}</Layout>
  </HeaderStateProvider>
);
