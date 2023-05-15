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
  return (
    <div className={styles.nftInfo}>
      <div className={styles.nftImageWrapper}>
        <img src={nftImage} className={styles.nftImage} />
        {selected && <div className={styles.selectedCollectionOverlay}></div>}
      </div>
      <div className={styles.nftContent}>
        <div className={styles.nftName}>{nftName}</div>
      </div>
    </div>
  );
};
