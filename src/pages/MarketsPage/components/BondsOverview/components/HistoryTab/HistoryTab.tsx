import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import RadioButtonField from '@frakt/pages/OfferPage/components/RadioButtonField';
import { RBOption } from '@frakt/components/RadioButton';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useHistoryLoansTab } from './hooks/useHistoryLoansTab';
import { HistoryTable } from '../HistoryTable';

import styles from './HistoryTab.module.scss';

interface HistoryTabProps {
  tableParams?: { classNames: string; scrollX: number };
  containerClassName?: string;
  marketPubkey?: string;
  isFixedTable?: boolean;
}

const HistoryTab: FC<HistoryTabProps> = ({
  tableParams,
  containerClassName,
  marketPubkey,
  isFixedTable,
}) => {
  const {
    ref,
    showOwnerBonds,
    bondsHistory,
    onChangeFilterOption,
    selectedFilterOption,
    setShowOwnerBonds,
    shouldShowEmptyList,
    shouldShowLoader,
    shouldShowHistoryTable,
    options,
    isLoadingNextPage,
    isFetchingNextPage,
  } = useHistoryLoansTab(marketPubkey, isFixedTable);

  return (
    <>
      <div className={classNames(styles.wrapper, containerClassName)}>
        <BondsTableHeader
          selectedFilterOption={selectedFilterOption}
          setShowOwnerBonds={setShowOwnerBonds}
          onChangeFilterOption={onChangeFilterOption}
          showOwnerBonds={showOwnerBonds}
          options={options}
        />

        {shouldShowLoader && <Loader />}
        {shouldShowHistoryTable && (
          <div
            className={styles.tableWrapper}
            id={`historyTable_${marketPubkey}`}
          >
            <HistoryTable
              className={classNames(styles.table, tableParams?.classNames)}
              data={bondsHistory}
              breakpoints={{ scrollX: tableParams?.scrollX || 744 }}
            />
            {!shouldShowLoader &&
              (isLoadingNextPage || isFetchingNextPage) &&
              isFixedTable && <Loader className={styles.loader} size="small" />}
            {!shouldShowLoader && isFetchingNextPage && !isFixedTable && (
              <Loader size="small" />
            )}
          </div>
        )}
        <div ref={ref} />
      </div>
      {shouldShowEmptyList && <EmptyListComponent />}
    </>
  );
};

export default HistoryTab;

export const EmptyListComponent = () => (
  <EmptyList className={styles.emptyList} text="No bonds at the moment" />
);

export const BondsTableHeader: FC<{
  selectedFilterOption: string;
  onChangeFilterOption: (nextOption: RBOption<string>) => void;
  showOwnerBonds: boolean;
  setShowOwnerBonds: (value: boolean) => void;
  options?: RBOption<string>[];
}> = ({
  selectedFilterOption,
  onChangeFilterOption,
  showOwnerBonds,
  setShowOwnerBonds,
  options,
}) => {
  const { connected } = useWallet();

  return (
    <div className={styles.bondsTableHeader}>
      <RadioButtonField
        currentOption={{
          label: selectedFilterOption,
          value: selectedFilterOption,
        }}
        onOptionChange={onChangeFilterOption}
        options={options}
        className={styles.radio}
        classNameInner={styles.radioButton}
      />
      {connected && (
        <Toggle
          value={showOwnerBonds}
          onChange={() => setShowOwnerBonds(!showOwnerBonds)}
          label="My activity"
        />
      )}
    </div>
  );
};
