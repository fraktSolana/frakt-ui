import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import { NFT } from '../../types';
import styles from './NFTCard.module.scss';

interface NFTCardProps extends NFT {
  onClick?: () => void;
  className?: string;
}

const NFTCard: FC<NFTCardProps> = ({
  image,
  className,
  maxLoanValue: rawMaxLoanValue,
  duration,
  fee,
  onClick,
}) => {
  const { connected } = useWallet();

  const maxLoanValue = (rawMaxLoanValue / 1e9)?.toFixed(0);

  return (
    <div
      onClick={onClick ? onClick : null}
      className={classNames(styles.card, className, {
        [styles.clicable]: onClick,
      })}
    >
      <img src={image} className={styles.nftImage} />
      <div
        className={classNames(styles.nftInfo, {
          [styles.primary]: connected,
        })}
      >
        <p className={styles.value}>{duration} days</p>
        <p className={styles.label}>
          Fee: <p className={styles.value}> {fee} ◎</p>
        </p>
        {connected && (
          <Button type="secondary" className={styles.button}>
            Get {maxLoanValue} ◎
          </Button>
        )}
      </div>
      {!connected && <div className={styles.badge}>+ {maxLoanValue} ◎</div>}
    </div>
  );
};

export default NFTCard;
