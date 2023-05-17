import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
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
  const { publicKey, connected } = useWallet();

  const { lotteryTickets } = useFetchUserTickets();
  const { ref, inView } = useIntersection();
  const { queryData } = useRaffleSort();

  const userQueryData = { ...queryData, user: publicKey?.toBase58() };

  const {
    data: raffleList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
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

  const { data: auctionList, loading, hideAuction } = useFetchAuctionsList();

  if (!connected) {
    return (
      <ConnectWalletSection text="Connect your wallet to check liquidations raffle" />
    );
  }

  if (loading) return <Loader />;

  const raffleListWithAuctions = [...auctionList, ...(raffleList || [])];

  return (
    <RafflesList withRafflesInfo>
      {raffleListWithAuctions?.length ? (
        <>
          <div className={styles.rafflesList}>
            {raffleListWithAuctions.map((raffle: any) => {
              if (!raffle?.buyPrice) {
                return (
                  <LiquidationRaffleCard
                    key={raffle.rafflePubKey}
                    raffle={raffle}
                    disabled={lotteryTickets?.currentTickets < 1}
                  />
                );
              }
              return (
                <AuctionCard
                  key={raffle.rafflePubKey}
                  hideAuction={hideAuction}
                  auction={raffle}
                />
              );
            })}
            {!!isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </div>
        </>
      ) : (
        <EmptyList text="No ongoing raffles at the moment" />
      )}
    </RafflesList>
  );
};

export default OngoingRaffleTab;
