import { FC, PropsWithChildren } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '@frakt/components/WalletModal';
import Button from '@frakt/components/Button';

import styles from './AuctionCardBackdrop.module.scss';

interface AuctionCardBackdropProps {
  className?: string;
  onSubmit: () => Promise<void>;
  submitButtonText: string;
}

const AuctionCardBackdrop: FC<PropsWithChildren<AuctionCardBackdropProps>> = ({
  children,
  onSubmit,
  submitButtonText,
}) => {
  const { connected } = useWallet();
  const { setVisible: setVisibleWalletModal } = useWalletModal();

  const onHandleSubmit = () => {
    if (connected) {
      onSubmit();
    } else {
      setVisibleWalletModal(true);
    }
  };

  return (
    <div className={styles.card}>
      {children}
      <Button
        onClick={onHandleSubmit}
        type="secondary"
        className={styles.button}
      >
        {connected ? submitButtonText : 'Connect wallet'}
      </Button>
    </div>
  );
};

export default AuctionCardBackdrop;
