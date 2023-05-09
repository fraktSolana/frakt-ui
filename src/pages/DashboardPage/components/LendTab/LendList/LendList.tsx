import { FC } from 'react';

import LendCard from '../LendCard';
import styles from './LendList.module.scss';
import { Loader } from '@frakt/components/Loader';

interface LendListProps {
  data: any[];
  isLoading: boolean;
}

const LendList: FC<LendListProps> = ({ data, isLoading }) => {
  return (
    <>
      <div className={styles.header}>
        <p className={styles.label}>collections</p>
        <p className={styles.label}>Total liquidity</p>
        <p className={styles.label}>Deposit yield</p>
      </div>
      {isLoading && !data?.length && <Loader />}

      {data?.length && (
        <div className={styles.cardsList}>
          {data?.map(({ image, name, depositYield }) => (
            <LendCard image={image} name={name} depositYield={depositYield} />
          ))}
        </div>
      )}
    </>
  );
};

export default LendList;
