import { FC } from 'react';

import InfinityScroll from '@frakt/components/InfinityScroll';
import { BorrowNft } from '@frakt/api/nft';
import NftCard from '../NFTCard';

import styles from './NFTsList.module.scss';

interface NFTsListProps {
  isLoading?: boolean;
  fetchNextPage?: () => void;
  nfts: BorrowNft[];
}

const NFTsList: FC<NFTsListProps> = ({ isLoading, fetchNextPage, nfts }) => {
  return (
    <InfinityScroll
      itemsToShow={nfts.length}
      next={fetchNextPage}
      wrapperClassName={styles.nftsList}
      isLoading={isLoading}
    >
      {nfts.map((nft: BorrowNft) => (
        <NftCard nftImage={nft.imageUrl} maxLoanValue={nft?.maxLoanValue} />
      ))}
    </InfinityScroll>
  );
};

export default NFTsList;
