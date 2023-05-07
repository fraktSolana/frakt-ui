import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import styles from './NFTCard.module.scss';

interface NftCardProps {
  nftImage: string;
  className?: string;
  maxLoanValue: string;
  duration: number;
  fee: number;
}

const NftCard: FC<NftCardProps> = ({
  nftImage,
  className,
  maxLoanValue,
  duration,
  fee,
}) => {
  const { connected } = useWallet();

  return (
    <div className={classNames(styles.card, className)}>
      <img src={nftImage} className={styles.nftImage} />
      <div
        className={classNames(styles.nftInfo, {
          [styles.primary]: connected,
        })}
      >
        <p className={styles.duration}>{duration} days</p>
        <p className={styles.fee}>Fee: {fee} ◎</p>
        {connected && (
          <Button type="secondary" className={styles.connectedBadge}>
            Get {maxLoanValue} ◎
          </Button>
        )}
      </div>
      {!connected && <div className={styles.badge}>+ {maxLoanValue} ◎</div>}
    </div>
  );
};

export default NftCard;
