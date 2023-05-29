import { FC } from 'react';

import { Loan, LoanType } from '@frakt/api/loans/types';
import Button from '@frakt/components/Button';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';

import { useLoanTransactions } from '../../RefinanceModal/hooks';
import { useLoanCard } from '../../LoanCard/hooks';
import RefinanceModal from '../../RefinanceModal';

import styles from '../LoansTable.module.scss';
import { LoadingModal } from '@frakt/components/LoadingModal';

export const MoreActionsCell: FC<{ loan: Loan }> = ({ loan }) => {
  const {
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
  } = useLoanCard(loan);

  const {
    onRefinance,
    isRefinanceModalVisible,
    closeRefinanceModal,
    openRefinanceModal,
    bestLoanParams,
    loadingModalVisible,
  } = useLoanTransactions({ loan });

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
          <Button onClick={openRefinanceModal} className={styles.repayButton}>
            Extend
          </Button>
        )}
        {/* <Button className={styles.repayButton}>Sell</Button> */}
      </div>
      <RefinanceModal
        loan={loan}
        bestLoanParams={bestLoanParams}
        visible={isRefinanceModalVisible}
        onCancel={closeRefinanceModal}
        onSubmit={onRefinance}
      />
      <PartialRepayModal
        visible={partialRepayModalVisible}
        onCancel={closePartialRepayModal}
        onPartialPayback={onPartialPayback}
        loan={loan}
      />
      <LoadingModal visible={loadingModalVisible} />
    </>
  );
};
