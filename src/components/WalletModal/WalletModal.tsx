import { useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useOnClickOutside } from '@frakt/hooks';
import { sendAmplitudeData } from '@frakt/utils/amplitude';

import { UserInfo } from './UserInfo';
import { WalletItem } from './WalletItem';
import { useWalletModal } from './hooks';
import styles from './WalletModal.module.scss';

export const WalletModal = () => {
  const { connected, wallets, select } = useWallet();
  const { setVisible } = useWalletModal();

  const [changeWallet, setChangeWallet] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setVisible(false));

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.overlay}
        onClick={() => {
          setVisible(false);
          sendAmplitudeData('navigation-connect');
        }}
      />
      <div ref={ref} className={styles.contentWrapper}>
        {connected && !changeWallet && (
          <UserInfo setChangeWallet={setChangeWallet} />
        )}
        {(!connected || changeWallet) && (
          <div className={styles.walletItems}>
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
        )}
      </div>
    </div>
  );
};
