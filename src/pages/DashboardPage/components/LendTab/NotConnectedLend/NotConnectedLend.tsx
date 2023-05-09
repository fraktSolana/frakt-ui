import { FC } from 'react';

import styles from './NotConnectedLend.module.scss';
import { Search } from '../../Search';
import NFTsList from '../../NFTsList';
import Strategies from '../Strategies';
import Pools from '../Pools';

const NotConnectedLend: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchableList}>
        <Search
          title="Lend"
          tooltipText="Lend"
          onChange={null}
          className={styles.search}
        />
        <div className={styles.wrapperNftsList}>
          <NFTsList nfts={[]} isLoading={false} className={styles.nftsList} />
        </div>
      </div>
      <div className={styles.content}>
        <Strategies />
        <Pools />
      </div>
    </div>
  );
};

export default NotConnectedLend;
