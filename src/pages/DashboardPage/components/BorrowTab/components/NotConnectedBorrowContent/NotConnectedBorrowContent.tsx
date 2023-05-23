import { FC } from 'react';

import { useFetchCollectionsStats } from '@frakt/pages/DashboardPage/hooks';
import { NFT } from '@frakt/pages/DashboardPage/types';
import { CollectionsStats } from '@frakt/api/user';
import { Loader } from '@frakt/components/Loader';

import { useNotConnectedBorrowContent } from './hooks';
import CollectionsInfo from '../CollectionsInfo';
import { NFTsList } from '../../../NFTsList';
import { BorrowCard } from '../../../Cards';
import { Search } from '../../../Search';

import styles from './NotConnectedBorrowContent.module.scss';

const NotConnectedBorrowContent: FC = () => {
  const { data: collectionsStats } = useFetchCollectionsStats();
  const { isLoading, collections, isMobile, setSearch } =
    useNotConnectedBorrowContent();

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrapper}>
      {isMobile ? (
        <MobileContentView
          collections={collections}
          setSearch={setSearch}
          collectionsStats={collectionsStats}
        />
      ) : (
        <DesktopContentView
          collections={collections}
          setSearch={setSearch}
          collectionsStats={collectionsStats}
        />
      )}
    </div>
  );
};

export default NotConnectedBorrowContent;

interface ContentViewProps {
  collections: NFT[];
  setSearch: (value?: string) => void;
  collectionsStats: CollectionsStats;
}

const MobileContentView = ({
  collections,
  setSearch,
  collectionsStats,
}: ContentViewProps) => (
  <div className={styles.mobileContainer}>
    <Search title="1 click loan" onChange={setSearch} />
    <NFTsList emptyMessageClassName={styles.emptyMessage} nfts={collections} />
    <CollectionsInfo collectionsStats={collectionsStats} />
  </div>
);

const DesktopContentView = ({
  collections,
  setSearch,
  collectionsStats,
}: ContentViewProps) => (
  <div className={styles.gridContainer}>
    <Search
      className={styles.search}
      title="1 click loan"
      onChange={setSearch}
    />
    <div className={styles.title}>Available to borrow</div>
    <CollectionsInfo collectionsStats={collectionsStats} />
    {collections.map((nft) => (
      <BorrowCard key={nft.image} {...nft} />
    ))}
  </div>
);
