import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { Loader } from '@frakt/components/Loader';
import { Sort } from '@frakt/components/Table';

import { LoansHistoryTable } from '../LoansHistoryTable';
import { useFetchLoansHistory } from './hooks';

import styles from './LoansHistoryTab.module.scss';

const LoansHistoryTab: FC = () => {
  const { ref, inView } = useIntersection();
  const { connected } = useWallet();

  const [queryData, setQueryData] = useState<Sort>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFetchLoansHistory({ queryData });

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
          />
          {isFetchingNextPage && <Loader />}
          <div ref={ref} />
        </>
      )}

      {!data.length && isLoading && <Loader />}
    </>
  );
};

export default LoansHistoryTab;
