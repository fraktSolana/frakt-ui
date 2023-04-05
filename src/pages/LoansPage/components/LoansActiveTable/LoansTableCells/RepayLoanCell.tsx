import { FC } from 'react';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { Button } from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';

import { useLoanCard } from '../../LoanCard/hooks';

import styles from '../LoansTable.module.scss';

type Event = MouseEvent | TouchEvent;

export const RepayLoanCell: FC<{ loan: Loan }> = ({ loan }) => {
  const {
    closeLoadingModal,
    loadingModalVisible,
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
    transactionsLeft,
  } = useLoanCard(loan);

  return (
    <>
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
