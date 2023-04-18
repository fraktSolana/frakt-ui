import { FC } from 'react';
import classNames from 'classnames';

import { Loan } from '@frakt/api/loans/types';
import Button from '@frakt/components/Button';

import { PartialRepayModal } from '@frakt/components/PartialRepayModal';
import { LoadingModal } from '@frakt/components/LoadingModal';

import { useLoanCard } from '../../LoanCard/hooks';
import styles from '../LoansTable.module.scss';

export const MoreActionsCell: FC<{ loan: Loan; isCardView: boolean }> = ({
  loan,
  isCardView,
}) => {
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
      <div className={styles.buttonWrapper}>
        <Button
          type="secondary"
          onClick={(event: Event) => {
            onPayback();
            event.stopPropagation();
          }}
          className={classNames(styles.repayButton, {
            [styles.cardView]: isCardView,
          })}
        >
          Repay
        </Button>
        {/* <Button
          className={classNames(styles.repayButton, {
            [styles.cardView]: isCardView,
          })}
          disabled
        >
          Extend
        </Button>
        <Button
          className={classNames(styles.repayButton, {
            [styles.cardView]: isCardView,
          })}
          disabled
        >
          Sell
        </Button> */}
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
