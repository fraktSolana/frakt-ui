import { FC } from 'react';

import InfinityScroll from '@frakt/components/InfinityScroll';
import { BorrowNft } from '@frakt/api/nft';
import NftCard from '../NFTCard';

import styles from './NFTsList.module.scss';
import classNames from 'classnames';

interface NFTsListProps {
  isLoading?: boolean;
  fetchNextPage?: () => void;
  nfts: any[];
  onClick: (nft: any) => any;
}

const NFTsList: FC<NFTsListProps> = ({
  isLoading,
  fetchNextPage,
  nfts,
  onClick,
}) => {
  return (
    <InfinityScroll
      itemsToShow={nfts.length}
      next={fetchNextPage}
      wrapperClassName={styles.nftsList}
      isLoading={isLoading}
    >
      {nfts.map((nft: any) => (
        <NftCard onClick={() => onClick(nft)} {...nft} />
      ))}
    </InfinityScroll>
  );
};

export default NFTsList;
