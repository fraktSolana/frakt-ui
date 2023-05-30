import { FC } from 'react';

import { Loan, LoanType } from '@frakt/api/loans/types';
import Button from '@frakt/components/Button';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';

import { useLoanTransactions } from '../../RefinanceModal/hooks';
import { useLoanCard } from '../../LoanCard/hooks';
import RefinanceModal from '../../RefinanceModal';

import styles from '../LoansTable.module.scss';
import { LoadingModal } from '@frakt/components/LoadingModal';
import classNames from 'classnames';

export const MoreActionsCell: FC<{ loan: Loan; isCardView: boolean }> = ({
  loan,
  isCardView,
}) => {
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
      <div
        className={classNames(styles.buttonWrapper, {
          [styles.cardView]: isCardView,
        })}
      >
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
          <Button
            onClick={(event: Event) => {
              openRefinanceModal();
              event.stopPropagation();
            }}
            className={styles.repayButton}
          >
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
