import { FC } from 'react';

import { SolanaNFTLink } from '@frakt/components/SolanaLinks';

import styles from './AuctionNFTCardInfo.module.scss';

interface AuctionNFTCardInfoProps {
  nftCollectionName: string;
  nftImageUrl: string;
  nftName: string;
  nftMint: string;
}

const AuctionNFTCardInfo: FC<AuctionNFTCardInfoProps> = ({
  nftImageUrl,
  nftCollectionName,
  nftName,
  nftMint,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.content}>
      <img className={styles.nftImage} src={nftImageUrl} />
      <div className={styles.nftNamesInfos}>
        <p className={styles.nftName}>{nftName}</p>
        <p className={styles.nftCollectionName}>{nftCollectionName}</p>
      </div>
    </div>
    <SolanaNFTLink nftMint={nftMint} />
  </div>
);

export default AuctionNFTCardInfo;
