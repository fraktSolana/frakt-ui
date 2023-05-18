import { FC } from 'react';

import { Loan, LoanType } from '@frakt/api/loans/types';
import Button from '@frakt/components/Button';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';
import { LoadingModal } from '@frakt/components/LoadingModal';

import { useLoanCard, useLoanTransactions } from '../../LoanCard/hooks';
import styles from '../LoansTable.module.scss';

export const MoreActionsCell: FC<{ loan: Loan }> = ({ loan }) => {
  const {
    closeLoadingModal,
    loadingModalVisible,
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
    transactionsLeft,
  } = useLoanCard(loan);

  const { onRefinance } = useLoanTransactions({ loan });
  const isLoanBond = loan.loanType === LoanType.BOND;

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Button
          type="secondary"
          onClick={(event: Event) => {
            onPayback();
            event.stopPropagation();
          }}
          className={styles.repayButton}
        >
          Repay
        </Button>
        {isLoanBond && (
          <Button onClick={onRefinance} className={styles.repayButton}>
            Extend
          </Button>
        )}
        <Button className={styles.repayButton}>Sell</Button>
      </div>
      <PartialRepayModal
        visible={partialRepayModalVisible}
        onCancel={closePartialRepayModal}
        onPartialPayback={onPartialPayback}
        loan={loan}
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle={
          transactionsLeft
            ? `Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`
            : 'In order to transfer the NFT/s approval is needed'
        }
      />
    </>
  );
};
