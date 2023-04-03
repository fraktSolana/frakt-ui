import { FC } from 'react';
import styles from './TableComponents.module.scss';

interface CollectionInfoCellProps {
  nftImage: string;
  nftName: string;
}

export const CollectionInfoCell: FC<CollectionInfoCellProps> = ({
  nftImage,
  nftName,
}) => {
  return (
    <div className={styles.collectionInfo}>
      <img src={nftImage} className={styles.collectionImage} />
      <p className={styles.collectionName}>{nftName}</p>
    </div>
  );
};
