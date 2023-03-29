import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useIntersection } from '@frakt/hooks/useIntersection';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useBondsSort, useFetchAllBonds, useFetchBondsStats } from './hooks';
import { BondsTable } from '../BondsTable';
import BondsWidgets from '../BondsWidgets';

import styles from './BondsTab.module.scss';

const BondsTab: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { ref, inView } = useIntersection();
  const { connected } = useWallet();

  const { queryData } = useBondsSort();

  const [showOwnerBonds, setShowOwnerBonds] = useState<boolean>(false);

  const {
    data: bonds,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    hideBond,
    loading,
  } = useFetchAllBonds({ queryData, showOwnerBonds, marketPubkey });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const { bondsStats } = useFetchBondsStats();

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.bondsTableHeader}>
          <BondsWidgets
            locked={bondsStats?.tvl}
            activeLoans={bondsStats?.activeLoans}
          />
          <Toggle
            onChange={() => setShowOwnerBonds(!showOwnerBonds)}
            className={styles.toggle}
            label="My bonds only"
          />
        </div>

        {!connected && showOwnerBonds ? (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my bonds"
          />
        ) : (
          <>
            <BondsTable
              className={styles.bondsTable}
              loading={loading}
              data={bonds}
              breakpoints={{ scrollX: 744 }}
              hideBond={hideBond}
            />
            {!!isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </>
        )}
      </div>
      {!showOwnerBonds && !bonds.length && !loading && (
        <EmptyList
          className={styles.emptyList}
          text="No active bonds at the moment"
        />
      )}
      {connected && showOwnerBonds && !bonds.length && !loading && (
        <EmptyList
          className={styles.emptyList}
          text="You don't have any bonds"
        />
      )}
    </>
  );
};

export default BondsTab;
