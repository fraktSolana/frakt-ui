import { FC } from 'react';

import { Solana } from '@frakt/icons';

import styles from '../BorrowManualTable.module.scss';

interface NftInfoCellProps {
  nftName: string;
  nftImage: string;
  nftFloor: number;
  selected: boolean;
}

export const NftInfoCell: FC<NftInfoCellProps> = ({
  nftImage,
  nftName,
  nftFloor,
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
        <div className={styles.nftFloor}>
          <span>Floor:</span>
          <span>
            {(nftFloor / 1e9).toFixed(2)} <Solana />
          </span>
        </div>
      </div>
    </div>
  );
};
