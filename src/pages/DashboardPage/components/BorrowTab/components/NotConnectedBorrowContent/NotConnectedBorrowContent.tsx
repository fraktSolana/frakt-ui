import { FC } from 'react';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { Loader } from '@frakt/components/Loader';
import { TABLET_SIZE } from '@frakt/constants';
import { useWindowSize } from '@frakt/hooks';

import { SearchHeading, SearchableList } from '../SearchableList';
import AvailableBorrow from '../AvailableBorrow';
import { parseMarketsPreview } from './helpers';
import NFTCard from '../../../NFTCard';

import styles from './NotConnectedBorrowContent.module.scss';

const NotConnectedBorrowContent: FC = () => {
  const { marketsPreview, isLoading } = useMarketsPreview();

  const { width } = useWindowSize();
  const isMobile = width <= TABLET_SIZE;

  const collections = parseMarketsPreview(marketsPreview);

  return (
    <>
      {isLoading && !collections?.length ? (
        <Loader />
      ) : (
        <>
          {isMobile ? (
            <div className={styles.mobileContainer}>
              <AvailableBorrow />
              <SearchableList title="1 click loan" data={collections} />
            </div>
          ) : (
            <div className={styles.gridContainer}>
              <SearchHeading
                className={styles.search}
                title="1 click loan"
                onChange={null}
              />
              <div className={styles.title}>Available to borrow</div>
              <AvailableBorrow />
              {collections.map((nft) => (
                <NFTCard key={nft.image} {...nft} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NotConnectedBorrowContent;
