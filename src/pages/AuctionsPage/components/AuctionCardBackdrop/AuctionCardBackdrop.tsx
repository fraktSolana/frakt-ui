import { FC, PropsWithChildren } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '@frakt/components/WalletModal';
import Button from '@frakt/components/Button';

import styles from './AuctionCardBackdrop.module.scss';

interface AuctionCardBackdropProps {
  className?: string;
  onSubmit: () => Promise<void>;
  button?: {
    text?: string;
    disabled?: boolean;
  };
  badge?: {
    text: string;
    icon?: FC;
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
      {badge && <Badge {...badge} />}
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

const Badge = ({ text = '', icon = null }) => (
  <div className={styles.badge}>
    {icon && icon({})}
    <span>{text}</span>
  </div>
);
