import { FC } from 'react';

import { LoadingModal } from '@frakt/components/LoadingModal';
import { Button } from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';

import { LoansTable } from '../LoansTable';
import { useActiveLoans } from './hooks';

import styles from './LoansActiveTab.module.scss';

interface LoansActiveTabProps {
  loans: Loan[];
  isLoading: boolean;
}

const LoansActiveTab: FC<LoansActiveTabProps> = ({ loans, isLoading }) => {
  const { onBulkRepay, totalBorrowed, loadingModalVisible, closeLoadingModal } =
    useActiveLoans();

  return (
    <>
      <div className={styles.loanActiveTab}>
        <Button
          onClick={onBulkRepay}
          className={styles.repayButton}
          disabled={!totalBorrowed}
        >
          Bulk repay {totalBorrowed?.toFixed(2)} SOL
        </Button>
        <LoansTable
          className={styles.loansTable}
          data={loans}
          loading={isLoading}
        />
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
