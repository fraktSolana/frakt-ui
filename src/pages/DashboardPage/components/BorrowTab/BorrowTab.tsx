import { FC } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';

import NotConnectedBorrowContent from './components/NotConnectedBorrowContent';
import ConnectedBorrowContent from './components/ConnectedBorrowContent';
import styles from './BorrowTab.module.scss';

const BorrowTab: FC = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {connected && <ConnectedBorrowContent />}
      {!connected && <NotConnectedBorrowContent />}
    </div>
  );
};

export default BorrowTab;
