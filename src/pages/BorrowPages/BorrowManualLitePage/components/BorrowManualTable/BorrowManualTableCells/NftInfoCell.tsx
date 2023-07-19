import { FC } from 'react';

import styles from '../BorrowManualTable.module.scss';

interface NftInfoCellProps {
  nftName: string;
  nftImage: string;
  selected: boolean;
}

export const NftInfoCell: FC<NftInfoCellProps> = ({
  nftImage,
  nftName,
  selected,
}) => {
  const [nftCollectionName, nftNumber] = nftName.split('#');

  const displayNftNumber = nftNumber ? `#${nftNumber}` : '';

  return (
    <div className={styles.nftInfo}>
      <div className={styles.nftImageWrapper}>
        <img src={nftImage} className={styles.nftImage} />
        {selected && <div className={styles.selectedCollectionOverlay}></div>}
      </div>
      <div className={styles.nftContent}>
        <div className={styles.nftName}>{nftCollectionName}</div>
        <p className={styles.nftNumber}>{displayNftNumber}</p>
      </div>
    </div>
  );
};
