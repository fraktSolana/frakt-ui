import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './LendTab.module.scss';
import NotConnectedLend from './NotConnectedLend';

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
