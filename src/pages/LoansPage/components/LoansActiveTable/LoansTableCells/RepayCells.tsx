import { FC } from 'react';
import classNames from 'classnames';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { Loan } from '@frakt/api/loans/types';
import Button from '@frakt/components/Button';

import {
  useBulkRepayTransaction,
  useLoansTransactions,
} from '../../LoansActiveTab/hooks';

import styles from '../LoansTable.module.scss';

export const RepayCell: FC<{ loan: Loan; isCardView: boolean }> = ({
  loan,
  isCardView,
}) => {
  const {
    partialRepayModalVisible,
    closePartialRepayModal,
    onPartialPayback,
    onPayback,
    loadingModalVisible,
  } = useLoansTransactions(loan);

  const handleRepayLoan = (event: Event) => {
    onPayback();
    event.stopPropagation();
  };

  return (
    <>
      <div
        className={classNames(styles.buttonWrapper, {
          [styles.cardView]: isCardView,
        })}
      >
        <Button
          type="secondary"
          onClick={handleRepayLoan}
          className={styles.repayButton}
        >
          Repay
        </Button>
      </div>
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

export const HeaderRepayCell = () => {
  const { onBulkRepay, totalBorrowed, loadingModalVisible } =
    useBulkRepayTransaction();

  const displayValue = totalBorrowed ? totalBorrowed?.toFixed(2) : '';

  return (
    <>
      <Button
        type="secondary"
        onClick={onBulkRepay}
        className={styles.headerRepayButton}
        disabled={!totalBorrowed}
      >
        Repay {displayValue} ◎
      </Button>
      <LoadingModal visible={loadingModalVisible} />
    </>
  );
};
