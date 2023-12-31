import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { useIntersection } from '@frakt/hooks/useIntersection';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { useBondsSort, useFetchAllBonds, useFetchBondsStats } from './hooks';
import { BondsTable } from '../BondsTable';
import BondsWidgets from '../BondsWidgets';

import styles from './BondsTab.module.scss';

interface BondsTabProps {
  tableParams?: { classNames: string; scrollX: number };
  containerClassName?: string;
  showWidgets?: boolean;
  marketPubkey?: string;
}

const BondsTab: FC<BondsTabProps> = ({
  tableParams,
  containerClassName,
  showWidgets = true,
  marketPubkey: initialMarketPubkey,
}) => {
  const { ref, inView } = useIntersection();
  const { connected, publicKey } = useWallet();
  const { marketPubkey: routeMarketPubkey } = useParams<{
    marketPubkey: string;
  }>();

  const marketPubkey = initialMarketPubkey || routeMarketPubkey;

  const { queryData } = useBondsSort();

  const {
    data: bonds,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    hideBond,
    loading,
  } = useFetchAllBonds({
    queryData,
    marketPubkey,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const { bondsStats } = useFetchBondsStats({
    marketPubkey,
    walletPubkey: publicKey,
  });

  return (
    <>
      <div className={classNames(styles.wrapper, containerClassName)}>
        {showWidgets && (
          <div className={styles.bondsTableHeader}>
            <BondsWidgets
              locked={bondsStats?.tvl}
              activeLoans={bondsStats?.activeLoans}
            />
          </div>
        )}

        {connected && !bonds.length && loading && <Loader />}

        {!connected ? (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my loans"
          />
        ) : (
          <>
            <BondsTable
              className={classNames(styles.bondsTable, tableParams?.classNames)}
              data={bonds}
              breakpoints={{ scrollX: tableParams?.scrollX || 744 }}
              hideBond={hideBond}
            />
            {isFetchingNextPage && <Loader size="small" />}
            <div ref={ref} />
          </>
        )}
      </div>
      {connected && !bonds.length && !loading && (
        <EmptyList
          className={styles.emptyList}
          text="You don't have any bonds"
        />
      )}
    </>
  );
};

export default BondsTab;
