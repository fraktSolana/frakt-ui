import { FC, useEffect } from 'react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import { WonRaffleListItem } from '@frakt/api/raffle';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { useRaffleSort } from '../Liquidations/hooks';
import { useFetchRafflesList } from '../../hooks';
import WonRaffleCard from '../WonRaffleCard';
import RafflesList from '../RafflesList';

import styles from './WonRaffleTab.module.scss';

const WonRaffleTab: FC = () => {
  const { queryData } = useRaffleSort();
  const { ref, inView } = useIntersection();

  const {
    data: wonRaffleList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useFetchRafflesList({
    url: 'liquidation?history=true&',
    id: 'wonRaffleList',
    queryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  return (
    <>
      <RafflesList isWonList>
        {wonRaffleList?.length ? (
          <>
            <div className={styles.rafflesList}>
              {wonRaffleList?.map((raffle: WonRaffleListItem) => (
                <WonRaffleCard key={raffle.rafflePubKey} raffle={raffle} />
              ))}
            </div>
            {!!isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </>
        ) : (
          <EmptyList text="No raffles at the moment" />
        )}
      </RafflesList>
    </>
  );
};

export default WonRaffleTab;
