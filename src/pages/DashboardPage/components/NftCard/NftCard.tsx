import { FC } from 'react';
import classNames from 'classnames';

import styles from './NftCard.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import Button from '@frakt/components/Button';

interface NftCardProps {
  nftImage?: string;
}

const NftCard: FC<NftCardProps> = ({
  nftImage = 'https://pbs.twimg.com/media/FuaAl7sXoAIm_jk.png',
}) => {
  const { connected } = useWallet();
  return (
    <div className={styles.card}>
      <img src={nftImage} className={styles.nftImage} />
      <div
        className={classNames(styles.nftInfo, {
          [styles.connected]: connected,
        })}
      >
        <p className={styles.duration}>7 days</p>
        <p className={styles.fee}>Fee: 1</p>
        {connected && (
          <Button type="secondary" className={styles.connectedBadge}>
            Get 45
          </Button>
        )}
      </div>
      {!connected && <div className={styles.badge}>+ 45</div>}
    </div>
  );
};

export default NftCard;
