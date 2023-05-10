import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import NotConnectedLend from './NotConnectedLend';
import styles from './LendTab.module.scss';

const LendTab: FC = () => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {/* {connected && <ConnectedBorrowContent />} */}
      {!connected && <NotConnectedLend />}
    </div>
  );
};

export default LendTab;
