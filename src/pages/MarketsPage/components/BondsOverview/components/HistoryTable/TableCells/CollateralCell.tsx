import { FC } from 'react';

import { LightMeta } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const CollateralCell: FC<{ lightMeta: LightMeta }> = ({ lightMeta }) => {
  return (
    <div className={styles.fixedLeftRow}>
      <div className={styles.imageWrapper}>
        <img src={lightMeta.imageUrl} className={styles.nftImage} />
      </div>
      <div className={styles.nftName}>{lightMeta.name}</div>
    </div>
  );
};
