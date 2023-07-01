import { FC } from 'react';

import styles from './AuctionNFTCardInfo.module.scss';

interface AuctionNFTCardInfoProps {
  nftCollectionName: string;
  nftImageUrl: string;
  nftName: string;
}

const AuctionNFTCardInfo: FC<AuctionNFTCardInfoProps> = ({
  nftImageUrl,
  nftCollectionName,
  nftName,
}) => (
  <div className={styles.content}>
    <img className={styles.nftImage} src={nftImageUrl} />
    <div className={styles.nftNamesInfos}>
      <p className={styles.nftName}>{nftName}</p>
      <p className={styles.nftCollectionName}>{nftCollectionName}</p>
    </div>
  </div>
);

export default AuctionNFTCardInfo;
