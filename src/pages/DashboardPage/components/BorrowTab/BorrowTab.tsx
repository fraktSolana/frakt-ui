import { FC } from 'react';

import styles from './BorrowTab.module.scss';
import NftCard from '../NftCard';

const BorrowTab: FC = () => {
  return (
    <div className={styles.nftList}>
      <NftCard />
    </div>
  );
};

export default BorrowTab;
