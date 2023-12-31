import { useEffect } from 'react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import AuctionHistoryCard from '../AuctionHistoryCard';
import { useFetchAuctionsHistory } from './hooks';

import styles from './HistoryActionsTab.module.scss';

const HistoryActionsTab = () => {
  const { ref, inView } = useIntersection();

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useFetchAuctionsHistory();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage]);

  const showEmptyList = !data?.length && !isLoading;

  return (
    <>
      {isLoading && <Loader />}
      {!!data?.length && (
        <>
          <div className={styles.auctionsList}>
            {data?.map((auction) => (
              <AuctionHistoryCard
                key={auction.rafflePubKey}
                auction={auction}
              />
            ))}
          </div>
          {!!isFetchingNextPage && <Loader />}
          <div ref={ref} />
        </>
      )}
      {showEmptyList && <EmptyList text="No auctions" />}
    </>
  );
};

export default HistoryActionsTab;
