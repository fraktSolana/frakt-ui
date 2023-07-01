import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { RaffleListItem } from '@frakt/api/raffle';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { Loader } from '@frakt/components/Loader';
import EmptyList from '@frakt/components/EmptyList';

import { useFetchUserTickets, useFetchRafflesList } from '../../hooks';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { useRaffleSort } from '../Liquidations/hooks';
import RafflesList from '../RafflesList';

import styles from './OngoingRaffleTab.module.scss';

const OngoingRaffleTab: FC = () => {
  const { publicKey } = useWallet();

  const { lotteryTickets } = useFetchUserTickets();
  const { ref, inView } = useIntersection();
  const { queryData } = useRaffleSort();

  const userQueryData = { ...queryData, user: publicKey?.toBase58() };

  const {
    data: raffleList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    isLoading,
  } = useFetchRafflesList({
    url: 'liquidation',
    id: 'ongoingRaffleList',
    queryData: userQueryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const showList = !!raffleList?.length && !isLoading;
  const showEmptyList = !showList && !isLoading;

  return (
    <RafflesList withRafflesInfo>
      {isLoading && <Loader />}

      {showList && (
        <div className={styles.rafflesList}>
          {raffleList.map((raffle: RaffleListItem) => (
            <LiquidationRaffleCard
              key={raffle.rafflePubKey}
              raffle={raffle}
              disabled={lotteryTickets?.currentTickets < 1}
            />
          ))}
          {!!isFetchingNextPage && <Loader />}
          <div ref={ref} />
        </div>
      )}
      {showEmptyList && <EmptyList text="No ongoing raffles at the moment" />}
    </RafflesList>
  );
};

export default OngoingRaffleTab;
