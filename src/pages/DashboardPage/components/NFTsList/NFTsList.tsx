import { FC } from 'react';

import { useWalletNfts } from '@frakt/pages/BorrowPages/BorrowManualPage/hooks';
import InfinityScroll from '@frakt/components/InfinityScroll';

import NftCard from '../NftCard';
import styles from './NFTsList.module.scss';

const NFTsList: FC = () => {
  const { nfts, fetchNextPage, initialLoading, setSearch } = useWalletNfts();

  return (
    <InfinityScroll
      itemsToShow={nfts.length}
      next={fetchNextPage}
      wrapperClassName={styles.nftsList}
      isLoading={initialLoading}
    >
      {nfts.map((nft) => (
        <NftCard nftImage={nft.imageUrl} />
      ))}
    </InfinityScroll>
  );
};

export default NFTsList;
