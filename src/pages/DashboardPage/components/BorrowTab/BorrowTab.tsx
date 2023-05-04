import { FC } from 'react';

import styles from './BorrowTab.module.scss';
import NFTsList from '../NFTsList';
import AvailableBorrow from '../AvailableBorrow/AvailableBorrow';

const BorrowTab: FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* <NFTsList /> */}
      <AvailableBorrow />
      {/* <div className={styles.container}></div> */}
    </div>
  );
};

export default BorrowTab;
