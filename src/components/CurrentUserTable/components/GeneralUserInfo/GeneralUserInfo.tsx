import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { UserAvatar } from '@frakt/components/UserAvatar';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { copyToClipboard } from '@frakt/utils';
import { Copy } from '@frakt/icons';
import { useUserInfo } from '@frakt/hooks';
import styles from './GeneralUserInfo.module.scss';

const GeneralUserInfo: FC = () => {
  const { publicKey } = useWallet();
  const { data } = useUserInfo();

  return (
    <div className={styles.userWrapper}>
      <UserAvatar className={styles.avatar} imageUrl={data?.avatarUrl} />
      <CopiedUserAddress publicKey={publicKey} />
    </div>
  );
};

export default GeneralUserInfo;

const CopiedUserAddress = ({ publicKey }: { publicKey: web3.PublicKey }) => (
  <div className={styles.userInfo}>
    <div
      className={styles.walletInfo}
      onClick={() => copyToClipboard(publicKey?.toBase58())}
    >
      <p className={styles.address}>{shortenAddress(`${publicKey || ''}`)}</p>
      <Copy />
    </div>
  </div>
);
