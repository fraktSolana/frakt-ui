import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { selectLotteryTickets } from '@frakt/state/liquidations/selectors';
import { selectWalletPublicKey } from '@frakt/state/common/selectors';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import EmptyList from '@frakt/componentsNew/EmptyList';
import { useRaffleSort } from '../Liquidations/hooks';
import styles from './OngoingRaffleTab.module.scss';
import RafflesList from '../RafflesList';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { useRaffleInfo } from '@frakt/hooks/useRaffleData';

const OngoingRaffleTab: FC = () => {
  const lotteryTickets = useSelector(selectLotteryTickets);
  const publicKey = useSelector(selectWalletPublicKey);

  const { ref, inView } = useIntersection();
  const { queryData } = useRaffleSort();

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } =
    useRaffleInfo({ url: 'liquidation', id: 'ongoingRaffleList', queryData });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const raffleList = data?.pages?.map((page) => page.data).flat();

  return (
    <>
      {publicKey ? (
        <RafflesList withRafflesInfo>
          {raffleList?.length ? (
            <div className={styles.rafflesList} ref={ref}>
              {raffleList.map((raffle) => (
                <LiquidationRaffleCard
                  key={raffle.nftMint}
                  raffle={raffle}
                  disabled={lotteryTickets?.totalTickets < 1}
                />
              ))}
            </div>
          ) : (
            <EmptyList text="No ongoing raffles at the moment" />
          )}
        </RafflesList>
      ) : (
        <ConnectWalletSection text="Connect your wallet to check liquidations raffle" />
      )}
    </>
  );
};

export default OngoingRaffleTab;
