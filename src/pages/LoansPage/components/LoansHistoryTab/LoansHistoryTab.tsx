import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useIntersection } from '@frakt/hooks/useIntersection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';

import { LoansHistoryTable } from '../LoansHistoryTable';
import { useFetchLoansHistory } from './hooks';

import styles from './LoansHistoryTab.module.scss';

const LoansHistoryTab: FC = () => {
  const { ref, inView } = useIntersection();
  const { connected } = useWallet();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    sortParam,
    setQuerySearch,
  } = useFetchLoansHistory();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      {!connected ? (
        <ConnectWalletSection
          className={styles.emptyList}
          text="Connect your wallet to see my history"
        />
      ) : (
        <>
          <LoansHistoryTable
            className={styles.rootTable}
            data={data}
            sortParams={sortParam}
            setQuerySearch={setQuerySearch}
          />
          {isFetchingNextPage && (
            <div className={styles.loaderWrapper}>
              <Loader />
            </div>
          )}
          <div ref={ref} />
        </>
      )}

      {!data.length && isLoading && connected && (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      )}
      {connected && !data.length && !isLoading && (
        <EmptyList
          className={styles.emptyList}
          text="You don't have any loans"
        />
      )}
    </>
  );
};

export default LoansHistoryTab;
