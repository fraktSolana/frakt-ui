import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

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
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const { connected } = useWallet();

  const { ref, inView } = useIntersection();
  const { queryData } = useHistoryBondsSort();

  const [showOwnerBonds, setShowOwnerBonds] = useState<boolean>(true);
  const [filterOption, setFilterOption] = useState<string>(options[0].value);

  const {
    data: bondsHistory,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
    isLoading,
  } = useFetchBondsHistory({
    queryData,
    showOwnerBonds,
    eventType: filterOption,
    marketPubkey,
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
            value={showOwnerBonds}
            onChange={() => setShowOwnerBonds(!showOwnerBonds)}
            label="My activity"
          />
        </div>

        {!bondsHistory.length && isLoading && <Loader />}

        {!connected && showOwnerBonds ? (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my history"
          />
        ) : (
          <>
            <HistoryTable
              className={styles.table}
              data={bondsHistory}
              breakpoints={{ scrollX: 744 }}
            />
            {!!isFetchingNextPage && <Loader />}
            <div ref={ref} />
          </>
        )}
      </div>

      {!showOwnerBonds && !bondsHistory.length && !isLoading && (
        <EmptyList className={styles.emptyList} text="No bonds at the moment" />
      )}
      {showOwnerBonds && !bondsHistory.length && !isLoading && (
        <EmptyList className={styles.emptyList} text="No bonds at the moment" />
      )}
    </>
  );
};

export default HistoryTab;
