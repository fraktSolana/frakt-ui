import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import NotConnectedLend from './NotConnectedLend';
import ConnectedLend from './ConnectedLend';

import styles from './LendTab.module.scss';

const LendTab: FC = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {connected && <ConnectedLend />}
      {!connected && <NotConnectedLend />}
    </div>
  );
};

export default LendTab;
