import { FC } from 'react';

import InfinityScroll from '@frakt/components/InfinityScroll';
import NftCard from '../NFTCard';

import styles from './NFTsList.module.scss';
import { NFT } from '../../types';
import classNames from 'classnames';

interface NFTsListProps {
  isLoading?: boolean;
  fetchNextPage?: () => void;
  nfts: NFT[];
  onClick?: (nft: NFT) => void;
  className?: string;
}

const NFTsList: FC<NFTsListProps> = ({
  isLoading,
  fetchNextPage,
  nfts,
  onClick,
  className,
}) => {
  return (
    <InfinityScroll
      itemsToShow={nfts.length}
      next={fetchNextPage}
      wrapperClassName={classNames(styles.nftsList, className)}
      isLoading={isLoading}
    >
      {nfts.map((nft: NFT) => (
        <NftCard onClick={() => onClick(nft)} {...nft} />
      ))}
    </InfinityScroll>
  );
};

export default NFTsList;
