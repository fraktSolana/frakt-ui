import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const CollateralCell: FC<{ bond: Bond }> = ({ bond }) => {
  const { collateralBox } = bond;

  return (
    <div className={styles.fixedLeftRow}>
      <div className={styles.imageWrapper}>
        <img src={collateralBox?.nft?.imageUrl} className={styles.nftImage} />
      </div>
      <div className={styles.nftName}>{collateralBox?.nft?.name}</div>
    </div>
  );
};
