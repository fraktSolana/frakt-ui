import { FC, useState } from 'react';
import classNames from 'classnames';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { useDebounce, useWindowSize } from '@frakt/hooks';
import { Loader } from '@frakt/components/Loader';
import { TABLET_SIZE } from '@frakt/constants';

import AvailableBorrow from '../AvailableBorrow';
import { parseMarketsPreview } from './helpers';
import NFTsList from '../../../NFTsList';
import NFTCard from '../../../NFTCard';
import { Search } from '../Search';

import styles from './NotConnectedBorrowContent.module.scss';

const NotConnectedBorrowContent: FC = () => {
  const { marketsPreview, isLoading } = useMarketsPreview();

  const [search, setSearch] = useState('');

  const { width } = useWindowSize();
  const isMobile = width <= TABLET_SIZE;

  const collections = parseMarketsPreview(marketsPreview);

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const filteredCollections = collections.filter(({ name }) => {
    return name.toUpperCase().includes(search.toUpperCase());
  });

  if (isLoading && !filteredCollections?.length) return <Loader />;

  return (
    <div className={classNames(styles.wrapper, { [styles.mobile]: isMobile })}>
      {isMobile ? (
        <div className={styles.mobileContainer}>
          <AvailableBorrow />
          <Search title="1 click loan" onChange={setSearchDebounced} />
          <NFTsList nfts={filteredCollections} />
        </div>
      ) : (
        <div className={styles.gridContainer}>
          <Search
            className={styles.search}
            title="1 click loan"
            onChange={setSearchDebounced}
          />
          <div className={styles.title}>Available to borrow</div>
          <AvailableBorrow />
          {filteredCollections.map((nft) => (
            <NFTCard key={nft.image} {...nft} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotConnectedBorrowContent;
