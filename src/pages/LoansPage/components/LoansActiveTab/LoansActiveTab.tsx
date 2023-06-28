import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { LoadingModal } from '@frakt/components/LoadingModal';
import EmptyList from '@frakt/components/EmptyList';
import { Button } from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';
import Checkbox from '@frakt/components/Checkbox';

import { useActiveLoans, useFetchAllLoans } from './hooks';
import { LoansActiveTable } from '../LoansActiveTable';
import styles from './LoansActiveTab.module.scss';

const LoansActiveTab: FC = () => {
  const { connected } = useWallet();
  const { loans, isLoading } = useFetchAllLoans();

  const {
    onBulkRepay,
    isLedger,
    setIsLedger,
    totalBorrowed,
    loadingModalVisible,
    closeLoadingModal,
  } = useActiveLoans();

  return (
    <>
      <div className={styles.loanActiveTab}>
        {connected && !loans.length && isLoading && (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        )}

        {!connected && (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my loans"
          />
        )}
        {connected && !!loans.length && (
          <>
            <div className={styles.repayBulkWrapper}>
              <Button
                type="secondary"
                onClick={onBulkRepay}
                disabled={!totalBorrowed}
              >
                Repay {totalBorrowed?.toFixed(2)} SOL
              </Button>
              <Checkbox
                onChange={() => setIsLedger(!isLedger)}
                label="I use ledger"
                checked={isLedger}
              />
            </div>
            <LoansActiveTable
              cardClassName={styles.card}
              className={styles.loansTable}
              data={loans}
            />
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
