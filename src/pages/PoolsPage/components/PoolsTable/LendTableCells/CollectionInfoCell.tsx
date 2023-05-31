import { FC } from 'react';
import { isEmpty, map } from 'lodash';

import { LiquidityPool } from '@frakt/api/pools';

import styles from '../PoolsTable.module.scss';

export const CollectionInfoCell: FC<{ liquidityPool: LiquidityPool }> = ({
  liquidityPool,
}) => (
  <div className={styles.collectionInfo}>
    <LiquidityPoolImage {...liquidityPool} />
    <p className={styles.collectionName}>{liquidityPool?.name}</p>
  </div>
);

const LiquidityPoolImage: FC<{
  isPriceBased: boolean;
  collectionsAmount: number;
  imageUrl: string[];
}> = ({ isPriceBased, collectionsAmount, imageUrl }) => {
  const showLabelCollectionsAmount = collectionsAmount - 2 > 0;

  const renderImage = (image: string, idx: number) => (
    <img
      src={image}
      className={styles.image}
      key={idx}
      style={idx !== 0 ? { marginLeft: '-5px' } : null}
    />
  );

  const renderLabel = () => (
    <span className={styles.label}>+{collectionsAmount - 2}</span>
  );

  return (
    <div className={styles.poolImage}>
      {!isEmpty(imageUrl) && map(imageUrl, renderImage)}
      {!isPriceBased && showLabelCollectionsAmount && renderLabel()}
    </div>
  );
};
