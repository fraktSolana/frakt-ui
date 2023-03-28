import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { RadioButton, RBOption } from '@frakt/components/RadioButton';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useIntersection } from '@frakt/hooks/useIntersection';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useFetchBondsHistory, useHistoryBondsSort } from './hooks';
import { HISTORY_FILTER_OPTIONS as options } from './constants';
import { HistoryTable } from '../HistoryTable';

import styles from './HistoryTab.module.scss';

const HistoryTab: FC = () => {
  const { connected } = useWallet();

  const { ref, inView } = useIntersection();
  const { queryData } = useHistoryBondsSort();

  const [showOwnerBonds, setShowOwnerBonds] = useState<boolean>(false);
  const [filterOption, setFilterOption] = useState<string>(options[0].value);

  const {
    data: bondsHistory,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    loading,
  } = useFetchBondsHistory({
    queryData,
    showOwnerBonds,
    eventType: filterOption,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const onChangeFilterOption = (nextOption: RBOption<string>) => {
    setFilterOption(nextOption.value);
  };

  return (
    <>
      {!connected && showOwnerBonds && (
        <ConnectWalletSection
          className={styles.emptyList}
          text="Connect your wallet to see my history"
        />
      )}
      <div className={styles.wrapper}>
        <div className={styles.bondsTableHeader}>
          <div className={styles.radio}>
            <RadioButton
              currentOption={{
                label: filterOption,
                value: filterOption,
              }}
              onOptionChange={onChangeFilterOption}
              options={options}
              className={styles.radioButton}
            />
          </div>
          <Toggle
            onChange={() => setShowOwnerBonds(!showOwnerBonds)}
            label="My history only"
          />
        </div>
        <HistoryTable
          className={styles.table}
          data={bondsHistory}
          breakpoints={{ scrollX: 744 }}
          loading={loading}
        />
        {!!isFetchingNextPage && <Loader />}
        <div ref={ref} />
      </div>
      {connected && !bondsHistory.length && !loading && (
        <EmptyList
          className={styles.emptyList}
          text="You don't have any bonds"
        />
      )}
    </>
  );
};

export default HistoryTab;
