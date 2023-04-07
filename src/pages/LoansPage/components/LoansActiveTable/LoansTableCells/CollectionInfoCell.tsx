import { FC } from 'react';

import styles from '../LoansTable.module.scss';

interface CollectionInfoCellProps {
  nftImage: string;
  nftName: string;
  selected?: boolean;
}

export const CollectionInfoCell: FC<CollectionInfoCellProps> = ({
  nftImage,
  nftName,
  selected,
}) => {
  return (
    <div className={styles.collectionInfo}>
      <div className={styles.collectionImageWrapper}>
        <img src={nftImage} className={styles.collectionImage} />
        {selected && <div className={styles.selectedCollectionOverlay}></div>}
      </div>
      <p className={styles.collectionName}>{nftName}</p>
    </div>
  );
};
