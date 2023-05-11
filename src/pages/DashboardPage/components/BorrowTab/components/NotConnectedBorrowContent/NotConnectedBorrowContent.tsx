import { FC } from 'react';

import { NFT } from '@frakt/pages/DashboardPage/types';
import { Loader } from '@frakt/components/Loader';

import { useNotConnectedBorrowContent } from './hooks';
import CollectionsInfo from '../CollectionsInfo';
import { NFTsList } from '../../../NFTsList';
import { BorrowCard } from '../../../Cards';
import { Search } from '../../../Search';

import styles from './NotConnectedBorrowContent.module.scss';

const NotConnectedBorrowContent: FC = () => {
  const { isLoading, collections, isMobile, setSearch } =
    useNotConnectedBorrowContent();

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrapper}>
      {isMobile ? (
        <MobileContentView collections={collections} setSearch={setSearch} />
      ) : (
        <DesktopContentView collections={collections} setSearch={setSearch} />
      )}
    </div>
  );
};

export default NotConnectedBorrowContent;

interface ContentViewProps {
  collections: NFT[];
  setSearch: (value?: string) => void;
}

const MobileContentView = ({ collections, setSearch }: ContentViewProps) => (
  <div className={styles.mobileContainer}>
    <Search title="1 click loan" onChange={setSearch} />
    <NFTsList nfts={collections} />
    <CollectionsInfo />
  </div>
);

const DesktopContentView = ({ collections, setSearch }: ContentViewProps) => (
  <div className={styles.gridContainer}>
    <Search
      className={styles.search}
      title="1 click loan"
      onChange={setSearch}
    />
    <div className={styles.title}>Available to borrow</div>
    <CollectionsInfo />
    {collections.map((nft) => (
      <BorrowCard key={nft.image} {...nft} />
    ))}
  </div>
);
