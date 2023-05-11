import { FC } from 'react';
import classNames from 'classnames';

import InfinityScroll from '@frakt/components/InfinityScroll';

import { NFT } from '../../types';
import { BorrowCard } from '../Cards';

import styles from './NFTsList.module.scss';

interface NFTsListProps {
  nfts: NFT[];
  onClick?: (nft: NFT) => void;
  fetchNextPage?: () => void;
  isLoading?: boolean;
  className?: string;
  emptyMessageClassName?: string;
}

export const NFTsList: FC<NFTsListProps> = ({
  nfts,
  onClick,
  fetchNextPage,
  isLoading,
  className,
  emptyMessageClassName,
}) => {
  return (
    <InfinityScroll
      itemsToShow={nfts.length}
      next={fetchNextPage}
      wrapperClassName={classNames(styles.nftsList, className)}
      isLoading={isLoading}
      customLoader={<p className={styles.loader}>loading your jpegs</p>}
      emptyMessageClassName={classNames(
        styles.emptyMessage,
        emptyMessageClassName,
      )}
    >
      {nfts.map((nft: NFT) => (
        <BorrowCard onClick={() => onClick(nft)} {...nft} />
      ))}
    </InfinityScroll>
  );
};
