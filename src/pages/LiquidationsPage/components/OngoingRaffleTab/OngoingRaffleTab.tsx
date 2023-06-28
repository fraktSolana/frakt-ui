import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AuctionListItem, RaffleListItem } from '@frakt/api/raffle';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { Loader } from '@frakt/components/Loader';
import EmptyList from '@frakt/components/EmptyList';

import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { useRaffleSort } from '../Liquidations/hooks';
import RafflesList from '../RafflesList';
import AuctionCard from '../AuctionCard';
import {
  useFetchUserTickets,
  useFetchAuctionsList,
  useFetchRafflesList,
} from '../../hooks';

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

  const {
    data: auctionsList,
    loading: isAuctionsListLoading,
    hideAuction,
  } = useFetchAuctionsList();

  const createAuctionsList = () => {
    return auctionsList.map((auction: AuctionListItem) => (
      <AuctionCard
        key={auction.nftMint}
        auction={auction}
        hideAuction={hideAuction}
      />
    ));
  };

  const createRafflesList = () => {
    return raffleList.map((raffle: RaffleListItem) => (
      <LiquidationRaffleCard
        key={raffle.rafflePubKey}
        raffle={raffle}
        disabled={lotteryTickets?.currentTickets < 1}
      />
    ));
  };

  const isLoadingOrAuctionsListLoading = isLoading || isAuctionsListLoading;
  const hasRaffles = !!auctionsList?.length || !!raffleList?.length;
  const showList = hasRaffles && !isLoadingOrAuctionsListLoading;
  const showEmptyList = !showList && !isLoadingOrAuctionsListLoading;

  return (
    <RafflesList withRafflesInfo>
      {isLoadingOrAuctionsListLoading && <Loader />}

      {showList && (
        <div className={styles.rafflesList}>
          {createAuctionsList()}
          {createRafflesList()}
          {!!isFetchingNextPage && <Loader />}
          <div ref={ref} />
        </div>
      )}
      {showEmptyList && <EmptyList text="No ongoing raffles at the moment" />}
    </RafflesList>
  );
};

export default OngoingRaffleTab;
