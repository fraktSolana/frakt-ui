import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useIntersection } from '@frakt/hooks/useIntersection';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useBondsSort, useFetchAllBonds, useMarketsPage } from '../../hooks';
import { createBondsStats } from '../../helpers';
import { BondsTable } from '../BondsTable';
import BondsWidgets from '../BondsWidgets';

import styles from './BondsTab.module.scss';

const BondsTab: FC = () => {
  const { connected } = useWallet();
  const { ref, inView } = useIntersection();

  const { loading, hideUserBond } = useMarketsPage();
  const { queryData } = useBondsSort();

  const {
    data: bonds,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useFetchAllBonds({ queryData });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const { locked, activeLoans } = createBondsStats(bonds);

  return (
    <>
      {!connected && (
        <ConnectWalletSection
          className={styles.emptyList}
          text="Connect your wallet to see my bonds"
        />
      )}

      {connected && (
        <div className={styles.wrapper}>
          <div className={styles.bondsTableHeader}>
            <BondsWidgets locked={locked} activeLoans={activeLoans} />
            <Toggle className={styles.toggle} label="My bonds only" />
          </div>
          <BondsTable
            className={styles.bondsTable}
            loading={loading}
            data={bonds}
            breakpoints={{ scrollX: 744 }}
            hideBond={hideUserBond}
          />
          {!!isFetchingNextPage && <Loader />}
          <div ref={ref} />
        </div>
      )}

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
