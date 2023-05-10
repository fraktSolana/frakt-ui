import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import { CardBackdrop } from './CardBackdrop';
import { NFT } from '../../types';

import styles from './Cards.module.scss';

interface BorrowCardProps extends NFT {
  onClick?: () => void;
  className?: string;
}

export const BorrowCard: FC<BorrowCardProps> = ({
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
    <CardBackdrop image={image} className={className} onClick={onClick}>
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
    </CardBackdrop>
  );
};

export default BorrowCard;

export const LendCard = ({ image, activeLoans, amount, apr }) => (
  <CardBackdrop image={image}>
    <div className={styles.nftInfo}>
      <p className={styles.value}>{amount?.toFixed(0)} ◎</p>
      <p className={styles.value}>in {activeLoans} Loans</p>
    </div>
    <div className={styles.badge}>{apr?.toFixed(0)} %</div>
  </CardBackdrop>
);
