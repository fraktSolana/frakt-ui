import { FC } from 'react';

import styles from './BorrowTab.module.scss';
import NFTsList from '../NFTsList';

const BorrowTab: FC = () => {
  return (
    <div className={styles.wrapper}>
      <NFTsList />
      <div className={styles.container}></div>
    </div>
  );
};

export default BorrowTab;
