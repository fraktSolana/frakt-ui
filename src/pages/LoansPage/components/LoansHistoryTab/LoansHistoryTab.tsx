import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useIntersection } from '@frakt/hooks/useIntersection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import { Sort } from '@frakt/components/Table';

import { LoansHistoryTable } from '../LoansHistoryTable';
import { useFetchLoansHistory } from './hooks';

import styles from './LoansHistoryTab.module.scss';

const LoansHistoryTab: FC = () => {
  const { ref, inView } = useIntersection();
  const { connected } = useWallet();

  const [queryData, setQueryData] = useState<Sort>(null);
  const [querySearch, setQuerySearch] = useState<string>('');

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFetchLoansHistory({ queryData, querySearch });

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
            setQueryData={setQueryData}
            setQuerySearch={setQuerySearch}
          />
          {isFetchingNextPage && <Loader />}
          <div ref={ref} />
        </>
      )}

      {!data.length && isLoading && <Loader />}
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
