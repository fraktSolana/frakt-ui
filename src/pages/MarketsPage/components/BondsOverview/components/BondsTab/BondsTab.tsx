import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useIntersection } from '@frakt/hooks/useIntersection';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { useBondsSort, useFetchAllBonds, useFetchBondsStats } from './hooks';
import { BondsTable } from '../BondsTable';
import BondsWidgets from '../BondsWidgets';

import styles from './BondsTab.module.scss';

const BondsTab: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { ref, inView } = useIntersection();
  const { connected, publicKey } = useWallet();

  const { queryData } = useBondsSort();

  const {
    data: bonds,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    hideBond,
    loading,
  } = useFetchAllBonds({ queryData, marketPubkey });

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
      <div className={styles.wrapper}>
        <div className={styles.bondsTableHeader}>
          <BondsWidgets
            locked={bondsStats?.tvl}
            activeLoans={bondsStats?.activeLoans}
          />
        </div>

        {!bonds.length && loading && <Loader />}

        {!connected ? (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my bonds"
          />
        ) : (
          <>
            <BondsTable
              className={styles.bondsTable}
              data={bonds}
              breakpoints={{ scrollX: 744 }}
              hideBond={hideBond}
            />
            {isFetchingNextPage && <Loader />}
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
