import { FC } from 'react';
import classNames from 'classnames';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import RadioButtonField from '@frakt/pages/OfferPage/components/RadioButtonField';
import { RBOption } from '@frakt/components/RadioButton';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';

import { useHistoryLoansTab } from './hooks/useHistoryLoansTab';
import { HISTORY_FILTER_OPTIONS as options } from './constants';
import { HistoryTable } from '../HistoryTable';

import styles from './HistoryTab.module.scss';

interface HistoryTabProps {
  tableParams?: { classNames: string; scrollX: number };
  containerClassName?: string;
  isFixedTable?: boolean;
}

const HistoryTab: FC<HistoryTabProps> = ({
  tableParams,
  containerClassName,
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
    shouldShowConnectSection,
    shouldShowHistoryTable,
    isLoadingNextPage,
    isFetchingNextPage,
  } = useHistoryLoansTab(isFixedTable);

  return (
    <>
      <div className={classNames(styles.wrapper, containerClassName)}>
        <BondsTableHeader
          selectedFilterOption={selectedFilterOption}
          setShowOwnerBonds={setShowOwnerBonds}
          onChangeFilterOption={onChangeFilterOption}
          showOwnerBonds={showOwnerBonds}
        />

        {shouldShowLoader && <Loader />}
        {shouldShowConnectSection && <ConnectWalletSectionComponent />}
        {shouldShowHistoryTable && (
          <div className={styles.tableWrapper}>
            <HistoryTable
              className={classNames(styles.table, tableParams?.classNames)}
              data={bondsHistory}
              breakpoints={{ scrollX: tableParams?.scrollX || 744 }}
            />
            {!shouldShowLoader && isLoadingNextPage && isFixedTable && (
              <Loader className={styles.loader} size="small" />
            )}
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

export const ConnectWalletSectionComponent = () => (
  <ConnectWalletSection
    className={styles.emptyList}
    text="Connect your wallet to see my history"
  />
);

export const BondsTableHeader: FC<{
  selectedFilterOption: string;
  onChangeFilterOption: (nextOption: RBOption<string>) => void;
  showOwnerBonds: boolean;
  setShowOwnerBonds: (value: boolean) => void;
}> = ({
  selectedFilterOption,
  onChangeFilterOption,
  showOwnerBonds,
  setShowOwnerBonds,
}) => (
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
    <Toggle
      value={showOwnerBonds}
      onChange={() => setShowOwnerBonds(!showOwnerBonds)}
      label="My activity"
    />
  </div>
);
