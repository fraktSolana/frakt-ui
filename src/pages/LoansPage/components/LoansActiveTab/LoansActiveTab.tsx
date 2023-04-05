import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { LoadingModal } from '@frakt/components/LoadingModal';
import EmptyList from '@frakt/components/EmptyList';
import { Button } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';

import { useActiveLoans, useFetchAllLoans } from './hooks';
import { LoansActiveTable } from '../LoansActiveTable';

import styles from './LoansActiveTab.module.scss';

const LoansActiveTab: FC = () => {
  const { connected } = useWallet();
  const { loans, isLoading } = useFetchAllLoans();

  const { onBulkRepay, totalBorrowed, loadingModalVisible, closeLoadingModal } =
    useActiveLoans();

  return (
    <>
      <div className={styles.loanActiveTab}>
        {!loans.length && isLoading && <Loader />}

        {!connected && !isLoading && (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my loans"
          />
        )}
        {connected && !!loans.length && (
          <>
            <Button
              type="secondary"
              onClick={onBulkRepay}
              className={styles.repayButton}
              disabled={!totalBorrowed}
            >
              Bulk repay {totalBorrowed?.toFixed(2)} SOL
            </Button>
            <LoansActiveTable className={styles.loansTable} data={loans} />
          </>
        )}
      </div>
      {connected && !loans.length && !isLoading && (
        <EmptyList
          className={styles.emptyList}
          text="You don't have any loans"
        />
      )}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default LoansActiveTab;
