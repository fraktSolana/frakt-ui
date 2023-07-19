import { FC } from 'react';

import Checkbox from '@frakt/components/Checkbox';

import styles from '../LoansTable.module.scss';

interface CollectionInfoCellProps {
  nftImage: string;
  nftName: string;
  selected?: boolean;
  onChangeCheckbox?: () => void;
  isCardView?: boolean;
}

export const CollectionInfoCell: FC<CollectionInfoCellProps> = ({
  nftImage,
  nftName,
  selected,
  onChangeCheckbox,
  isCardView,
}) => {
  const [nftCollectionName, nftNumber] = nftName.split('#');

  const displayNftNumber = nftNumber ? `#${nftNumber}` : '';

  return (
    <div className={styles.collectionInfo}>
      {onChangeCheckbox && !isCardView && (
        <Checkbox
          className={styles.checkbox}
          classNameInnerContent={styles.checkboxInnerContent}
          onChange={onChangeCheckbox}
          checked={selected}
        />
      )}
      <div className={styles.collectionImageWrapper}>
        <img src={nftImage} className={styles.collectionImage} />
        {selected && isCardView && (
          <div className={styles.selectedCollectionOverlay} />
        )}
      </div>
      <div className={styles.nftCollectionNames}>
        <p className={styles.collectionName}>{nftCollectionName}</p>
        <p className={styles.nftNumber}>{displayNftNumber}</p>
      </div>
    </div>
  );
};
