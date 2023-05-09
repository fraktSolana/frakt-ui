import { FC } from 'react';
import classNames from 'classnames';

import InfinityScroll from '@frakt/components/InfinityScroll';
import NFTCard from '../NFTCard';

import styles from './NFTsList.module.scss';
import { NFT } from '../../types';

interface NFTsListProps {
  nfts: NFT[];
  onClick?: (nft: NFT) => void;
  fetchNextPage?: () => void;
  isLoading?: boolean;
  className?: string;
}

const NFTsList: FC<NFTsListProps> = ({
  nfts,
  onClick,
  fetchNextPage,
  isLoading,
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
        <NFTCard onClick={() => onClick(nft)} {...nft} />
      ))}
    </InfinityScroll>
  );
};

export default NFTsList;
