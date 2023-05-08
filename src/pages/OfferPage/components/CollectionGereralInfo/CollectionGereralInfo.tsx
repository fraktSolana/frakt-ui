import { FC } from 'react';

import styles from './CollectionGereralInfo.module.scss';
import { Market } from '@frakt/api/bonds';
import classNames from 'classnames';

interface CollectionGereralInfoProps {
  market: Market;
  loading: boolean;
}

const CollectionGereralInfo: FC<CollectionGereralInfoProps> = ({
  market,
  loading,
}) => {
  return (
    <div className={styles.floorWrapper}>
      <div className={styles.floorCard}>
        <h6 className={styles.floorCardTitle}>collection</h6>

        <div className={styles.cardCollection}>
          <img
            className={styles.collectionImage}
            src={market?.collectionImage}
            alt={market?.collectionName}
          />
          <span className={styles.floorCardValue}>
            {!loading ? market?.collectionName : '--'}
          </span>
        </div>
      </div>
      <div className={styles.floorCard}>
        <h6 className={styles.floorCardTitle}>floor</h6>
        <span className={classNames(styles.floorCardValue, styles.florPrice)}>
          {!loading
            ? (market?.oracleFloor.floor / 1e9).toFixed(2) + ' sol'
            : '--'}
        </span>
      </div>
    </div>
  );
};

export default CollectionGereralInfo;
