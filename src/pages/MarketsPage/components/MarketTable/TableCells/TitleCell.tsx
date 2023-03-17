import { FC } from 'react';
import classNames from 'classnames';

import { StarActive } from '@frakt/icons';

import { MarketPreview } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const TitleCell: FC<{ market: MarketPreview }> = ({ market }) => {
  return (
    <div className={classNames(styles.row, styles.rowLeft)}>
      <StarActive className={styles.starIcon} />
      <img src={market.collectionImage} className={styles.nftImage} />
      <div className={styles.nftName}>{market.collectionName}</div>
    </div>
  );
};
