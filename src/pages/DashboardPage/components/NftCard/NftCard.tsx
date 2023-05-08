import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import { NFT } from '../../types';
import styles from './NFTCard.module.scss';

interface NftCardProps extends NFT {
  onClick?: (nft: NFT) => void;
  className?: string;
}

const NftCard: FC<NftCardProps> = ({
  image,
  className,
  maxLoanValue: rawMaxLoanValue,
  duration,
  fee,
  mint,
  onClick,
}) => {
  const { connected } = useWallet();

  const maxLoanValue = (rawMaxLoanValue / 1e9)?.toFixed(0);

  return (
    <div
      onClick={mint ? onClick : null}
      className={classNames(styles.card, className)}
    >
      <img src={image} className={styles.nftImage} />
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
