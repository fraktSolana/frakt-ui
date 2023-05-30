import { FC, useEffect } from 'react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { useRaffleSort } from '../Liquidations/hooks';
import { useFetchRafflesList } from '../../hooks';
import RafflesList from '../RafflesList';
import GraceCard from '../GraceCard';

import styles from './UpcomingRaffleTab.module.scss';

const UpcomingRaffleTab: FC = () => {
  const { queryData } = useRaffleSort();

  const { ref, inView } = useIntersection();

  const {
    data: graceList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useFetchRafflesList({
    url: 'liquidation/grace-list',
    id: 'graceList',
    queryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  return (
    <>
      <RafflesList isGraceList>
        {graceList?.length ? (
          <>
            <div className={styles.rafflesList}>
              {graceList?.map((raffle) => (
                <GraceCard key={raffle.nftMint} raffle={raffle} />
              ))}
            </div>
            {!!isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </>
        ) : (
          <EmptyList text="No loans on grace at the moment" />
        )}
      </RafflesList>
    </>
  );
};

export default UpcomingRaffleTab;
