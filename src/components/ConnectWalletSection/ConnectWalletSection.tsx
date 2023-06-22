import { FC } from 'react';
import classNames from 'classnames';

import { useWalletModal } from '@frakt/components/WalletModal';
import Button from '@frakt/components/Button';

import styles from './styles.module.scss';

interface ConnectWalletSectionProps {
  text: string;
  className?: string;
}

export const ConnectWalletSection: FC<ConnectWalletSectionProps> = ({
  text,
  className,
}) => {
  const { setVisible } = useWalletModal();

  return (
    <div className={classNames(styles.connectWallet, className)}>
      <p className={styles.connectWalletText}>{text}</p>
      <Button
        type="secondary"
        className={styles.connectWalletBtn}
        onClick={() => setVisible(true)}
      >
        Connect wallet
      </Button>
    </div>
  );
};
