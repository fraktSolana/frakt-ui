import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import NotConnectedLend from './NotConnectedLend';
import ConnectedLend from './ConnectedLend';

const LendTab: FC = () => {
  const { connected } = useWallet();

  return (
    <>
      {connected && <ConnectedLend />}
      {!connected && <NotConnectedLend />}
    </>
  );
};

export default LendTab;
