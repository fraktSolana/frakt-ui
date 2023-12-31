import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import ImageWithPreload from '@frakt/components/ImageWithPreload';
import { convertAprToApy } from '@frakt/utils';
import Button from '@frakt/components/Button';

import { CardBackdrop } from './CardBackdrop';
import { NFT } from '../../types';

import styles from './Cards.module.scss';

interface BorrowCardProps extends NFT {
  onClick?: (nextValue?: string) => void;
  className?: string;
}

export const BorrowCard: FC<BorrowCardProps> = ({
  image,
  className,
  maxLoanValue: rawMaxLoanValue,
  duration,
  fee,
  onClick,
  mint,
}) => {
  const { connected } = useWallet();

  const maxLoanValue = rawMaxLoanValue / 1e9 || 0;

  return (
    <CardBackdrop image={image} className={className} onClick={onClick}>
      <div
        className={classNames(styles.nftInfo, {
          [styles.primary]: connected && !!mint,
        })}
      >
        <div className={styles.value}>{duration} days</div>
        <div className={styles.label}>
          Fee: <p className={styles.value}> {(fee || 0)?.toFixed(2)}◎</p>
        </div>
        {connected && !!mint && (
          <Button type="secondary" className={styles.button}>
            Get {maxLoanValue?.toFixed(2)}◎
          </Button>
        )}
      </div>
      {!mint && (
        <div className={styles.badge}>+ {maxLoanValue?.toFixed(0)}◎</div>
      )}
    </CardBackdrop>
  );
};

export default BorrowCard;

export const LendCard = ({
  image,
  activeLoans,
  amount,
  apr,
  collectionName,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(collectionName)}
      className={classNames(styles.card, styles.clicable)}
    >
      <ImageWithPreload src={image} className={styles.nftImage} />
      <div className={styles.nftInfo}>
        <p className={styles.value}>{parseFloat(amount)?.toFixed(2)}◎</p>
        <p className={styles.value}>in {activeLoans} Loans</p>
      </div>
      <div className={classNames(styles.badge, styles.lendBadge)}>
        {convertAprToApy(apr / 100)?.toFixed(0)}% <span>APY</span>
      </div>
    </div>
  );
};
