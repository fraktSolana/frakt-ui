import { FC, PropsWithChildren } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '@frakt/components/WalletModal';
import Button from '@frakt/components/Button';

import styles from './AuctionCardBackdrop.module.scss';

interface AuctionCardBackdropProps {
  className?: string;
  onSubmit: () => Promise<void>;
  button: {
    text: string;
    disabled?: boolean;
  };
  badge?: {
    text: string;
    color?: string;
  };
}

const AuctionCardBackdrop: FC<PropsWithChildren<AuctionCardBackdropProps>> = ({
  children,
  onSubmit,
  button,
  badge,
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
      {badge && <Badge badge={badge} />}
      {children}
      <Button
        onClick={onHandleSubmit}
        type="secondary"
        className={styles.button}
        disabled={button?.disabled}
      >
        {connected ? button?.text : 'Connect wallet'}
      </Button>
    </div>
  );
};

export default AuctionCardBackdrop;

const DEFAULT_BADGE_COLOR = '#1F6BFF';

const Badge = ({ badge }) => (
  <div
    style={{ backgroundColor: badge.color || DEFAULT_BADGE_COLOR }}
    className={styles.badge}
  >
    {badge.text}
  </div>
);
