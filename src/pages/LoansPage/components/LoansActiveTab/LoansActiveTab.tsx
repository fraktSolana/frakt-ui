import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { LoadingModal } from '@frakt/components/LoadingModal';
import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import Checkbox from '@frakt/components/Checkbox';
import { Tabs } from '@frakt/components/Tabs';
import Button from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';

import { useBulkRepayTransaction } from './hooks/useLoansTransactions';
import { useLoansActiveTab } from './hooks/useLoansActiveTab';
import { LoansActiveTable } from '../LoansActiveTable';
import { useSelectedLoans } from '../../loansState';

import styles from './LoansActiveTab.module.scss';

const LoansActiveTab = () => {
  const { connected } = useWallet();

  const { sortParams, loans, tabsProps, isLoading, searchSelectParams } =
    useLoansActiveTab();

  return (
    <>
      {connected && !loans.length && isLoading && <Loader />}

      {connected && (
        <div className={styles.tabsWrapper}>
          <Tabs
            {...tabsProps}
            type="unset"
            className={styles.tabs}
            additionalClassNames={{
              tabClassName: styles.tab,
              tabActiveClassName: styles.tabActive,
            }}
          />
        </div>
      )}

      {connected && !!loans.length && (
        <>
          <LoansActiveTable
            cardClassName={styles.card}
            className={styles.loansTable}
            data={loans}
            sortParams={sortParams}
            duration={tabsProps.value}
            searchSelectParams={searchSelectParams}
            cardViewTableContent={<CardViewTableContent data={loans} />}
          />
        </>
      )}

      {!connected && (
        <ConnectWalletSection
          className={styles.emptyList}
          text="Connect your wallet to see my loans"
        />
      )}
      {connected && !loans.length && !isLoading && (
        <EmptyList
          className={styles.emptyList}
          text="You don't have any loans"
        />
      )}
    </>
  );
};

export default LoansActiveTab;

const CardViewTableContent = ({ data }: { data: Loan[] }) => {
  const { onBulkRepay, totalBorrowed, loadingModalVisible } =
    useBulkRepayTransaction();
  const { selection, clearSelection, setSelection } = useSelectedLoans();

  const onSelectAll = (): void => {
    if (selection?.length) {
      clearSelection();
    } else {
      setSelection(data as Loan[]);
    }
  };

  const displayValue = totalBorrowed ? totalBorrowed?.toFixed(2) : '';
  const displayLabel = !selection?.length ? 'Select all' : 'Deselect all';

  return (
    <div className={styles.cardViewTableContent}>
      <Checkbox
        checked={!!selection?.length}
        onChange={onSelectAll}
        label={displayLabel}
      />
      <div>
        <Button
          type="secondary"
          onClick={onBulkRepay}
          disabled={!totalBorrowed}
          className={styles.repayButton}
        >
          Repay {displayValue} ◎
        </Button>
      </div>
      <LoadingModal visible={loadingModalVisible} />
    </div>
  );
};
