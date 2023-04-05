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
      {selected && <div className={styles.selectedCollectionOverlay}></div>}
      {!selected && <img src={nftImage} className={styles.collectionImage} />}
      <p className={styles.collectionName}>{nftName}</p>
    </div>
  );
};
