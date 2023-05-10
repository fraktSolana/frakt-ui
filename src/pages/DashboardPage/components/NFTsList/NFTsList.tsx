import { FC } from 'react';
import classNames from 'classnames';

import InfinityScroll from '@frakt/components/InfinityScroll';

import { NFT } from '../../types';
import { BorrowCard } from '../Cards';

import styles from './NFTsList.module.scss';

interface BorrowListProps {
  nfts: NFT[];
  onClick?: (nft: NFT) => void;
  fetchNextPage?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const BorrowList: FC<BorrowListProps> = ({
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
        <BorrowCard onClick={() => onClick(nft)} {...nft} />
      ))}
    </InfinityScroll>
  );
};
