import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '@frakt/components/WalletModal';
import { UserAvatar } from '@frakt/components/UserAvatar';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { ArrowDownBtn } from '@frakt/icons';
import { useUserInfo } from '@frakt/hooks';

import styles from './ConnectButton.module.scss';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectButton: FC<ConnectButtonProps> = () => {
  const { toggleVisibility } = useWalletModal();
  const { publicKey: walletPubKey, connected } = useWallet();

  const { data } = useUserInfo();

  return (
    <button
      className={styles.container}
      onClick={() => {
        toggleVisibility();
      }}
    >
      {connected && (
        <>
          <UserAvatar className={styles.avatar} imageUrl={data?.avatarUrl} />
          {shortenAddress(walletPubKey?.toString())}
          <ArrowDownBtn className={styles.arrowDownIcon} />
        </>
      )}
      {!connected && 'Connect Wallet'}
    </button>
  );
};

export default ConnectButton;
