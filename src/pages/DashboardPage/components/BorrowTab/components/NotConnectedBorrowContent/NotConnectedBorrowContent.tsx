import { FC } from 'react';
import classNames from 'classnames';

import { NFT } from '@frakt/pages/DashboardPage/types';
import { Loader } from '@frakt/components/Loader';

import { useNotConnectedBorrowContent } from './hooks';
import CollectionsInfo from '../CollectionsInfo';
import { BorrowList } from '../../../NFTsList';
import { Search } from '../../../Search';
import { BorrowCard } from '../../../Cards';

import styles from './NotConnectedBorrowContent.module.scss';

const NotConnectedBorrowContent: FC = () => {
  const { isLoading, collections, isMobile, setSearch } =
    useNotConnectedBorrowContent();

  if (isLoading) return <Loader />;

  return (
    <div className={classNames(styles.wrapper, { [styles.mobile]: isMobile })}>
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
    <CollectionsInfo />
    <Search title="1 click loan" onChange={setSearch} />
    <BorrowList className={styles.nftsList} nfts={collections} />
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
