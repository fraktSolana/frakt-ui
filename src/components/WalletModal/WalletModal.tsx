import { FC, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useOnClickOutside } from '@frakt/hooks';

import { sendAmplitudeData } from '../../utils/amplitude';
import CurrentUserTable from '../CurrentUserTable';
import styles from './WalletModal.module.scss';
import { WalletItem } from './WalletItem';
import { useWalletModal } from './hooks';

export const WalletsItems: FC = () => {
  const { wallets, select } = useWallet();

  const { setVisible } = useWalletModal();

  return (
    <div className={styles.itemsContainer}>
      {wallets.map(({ adapter }, idx) => (
        <WalletItem
          key={idx}
          onClick={(): void => {
            select(adapter.name);
            setVisible(false);
          }}
          imageSrc={adapter.icon}
          imageAlt={adapter.name}
          name={adapter.name}
        />
      ))}
    </div>
  );
};

interface WalletModalProps {
  className?: string;
}

export const WalletModal: FC<WalletModalProps> = ({ className = '' }) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const ref = useRef();
  useOnClickOutside(ref, () => setVisible(false));

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        className={styles.overlay}
        onClick={() => {
          setVisible(false);
          sendAmplitudeData('navigation-connect');
        }}
      />
      <div ref={ref} className={`${styles.container} container`}>
        {connected ? (
          <CurrentUserTable className={styles.itemsContainer} />
        ) : (
          <WalletsItems />
        )}
      </div>
    </div>
  );
};
