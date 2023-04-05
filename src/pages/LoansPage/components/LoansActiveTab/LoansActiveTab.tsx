import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { Button } from '@frakt/components/Button';

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
        {!connected ? (
          <ConnectWalletSection
            className={styles.emptyList}
            text="Connect your wallet to see my loans"
          />
        ) : (
          <>
            <Button
              type="secondary"
              onClick={onBulkRepay}
              className={styles.repayButton}
              disabled={!totalBorrowed}
            >
              Bulk repay {totalBorrowed?.toFixed(2)} SOL
            </Button>
            <LoansActiveTable
              className={styles.loansTable}
              data={loans}
              loading={isLoading}
            />
          </>
        )}
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default LoansActiveTab;
