import { FC } from 'react';

import { Loan, LoanType } from '@frakt/api/loans';
import Button from '@frakt/components/Button';

import RefinanceModal, { useLoanTransactions } from '../../RefinanceModal';

import styles from '../LoansTable.module.scss';
import { LoadingModal } from '@frakt/components/LoadingModal';

export const RefinanceCell: FC<{ loan: Loan; isCardView: boolean }> = ({
  loan,
  isCardView,
}) => {
  const {
    onRefinance,
    isRefinanceModalVisible,
    closeRefinanceModal,
    openRefinanceModal,
    bestLoanParams,
    loadingModalVisible,
  } = useLoanTransactions({ loan });

  const isLoanBond = loan.loanType === LoanType.BOND;

  if (!isLoanBond) return <></>;

  const handleRefinanceLoan = (event: Event) => {
    openRefinanceModal();
    event.stopPropagation();
  };

  return (
    <>
      <Button onClick={handleRefinanceLoan} className={styles.repayButton}>
        Extend
      </Button>
      <RefinanceModal
        loan={loan}
        bestLoanParams={bestLoanParams}
        visible={isRefinanceModalVisible}
        onCancel={closeRefinanceModal}
        onSubmit={onRefinance}
      />
      <LoadingModal visible={loadingModalVisible} />
    </>
  );
};

export const HeaderRefinanceCell = () => {
  return (
    <></>
    // <Button className={styles.headerExtendButton} onClick={null}>
    //   Extend ◎
    // </Button>
  );
};
