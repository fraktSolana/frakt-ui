import { FC } from 'react';

import { formatNumbersWithCommas } from '@frakt/utils';
import { Loader } from '@frakt/components/Loader';

import { LendInfo } from '../types';
import styles from './TopLendList.module.scss';

interface LendListProps {
  data: LendInfo[];
  isLoading: boolean;
}

const TopLendList: FC<LendListProps> = ({ data = [], isLoading }) => {
  return (
    <>
      <div className={styles.header}>
        <p className={styles.label}>Top 3</p>
        <p className={styles.label}>Total liquidity</p>
        <p className={styles.label}>Deposit yield</p>
      </div>
      {isLoading && !data?.length && <Loader />}

      <div className={styles.cardsList}>
        {data.map((data, idx) => (
          <LendCard key={idx} {...data} />
        ))}
      </div>
    </>
  );
};

export default TopLendList;

const LendCard: FC<LendInfo> = ({
  name,
  image,
  totalLiquidity,
  depositYield,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <img className={styles.cardImage} src={image} />
        <p className={styles.cardName}>{name}</p>
      </div>
      <p className={styles.cardValue}>
        {formatNumbersWithCommas(totalLiquidity)}
      </p>
      <p className={styles.cardValue}>
        {formatNumbersWithCommas(depositYield)} %
      </p>
    </div>
  );
};
