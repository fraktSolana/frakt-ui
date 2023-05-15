import { FC } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';

import NotConnectedBorrowContent from './components/NotConnectedBorrowContent';
import ConnectedBorrowContent from './components/ConnectedBorrowContent';

const BorrowTab: FC = () => {
  const { connected } = useWallet();

  return (
    <>
      {connected && <ConnectedBorrowContent />}
      {!connected && <NotConnectedBorrowContent />}
    </>
  );
};

export default BorrowTab;
