import { FC } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';

import { Modal } from '@frakt/components/Modal';

import { Button } from '@frakt/components/Button';
import { formatValue } from '@frakt/utils';
import { Loan } from '@frakt/api/loans';

import { DurationCell } from '../LoansActiveTable';

import styles from './RefinanceModal.module.scss';
import { useSolanaBalance } from '@frakt/utils/accounts';

const REFINANCE_FEE = 4e7;

interface RefinanceModalProps {
  visible: boolean;
  onCancel: (event?: any) => void;
  onSubmit: () => void;
  loan: Loan;
  bestLoanParams: {
    borrowed: number;
    debt: number;
  };
}

const RefinanceModal: FC<RefinanceModalProps> = ({
  visible,
  onCancel,
  loan,
  onSubmit,
  bestLoanParams,
}) => {
  const difference = loan?.repayValue - bestLoanParams?.borrowed;
  const negativeDifference = difference > 0;
  const { balance: balanceLamports } = useSolanaBalance();
  const balance = balanceLamports * 1e9;
  const minBalanceForRefinance = difference + REFINANCE_FEE;

  const showWarningText = balance < minBalanceForRefinance;
  const warningText = `Ensure to have ${formatValue(
    minBalanceForRefinance,
    1e9,
  )} sol to refinance`;

  return (
    <Modal
      open={visible}
      centered
      onCancel={onCancel}
      width={684}
      footer={false}
      closable={false}
      className={styles.modal}
      closeIcon
    >
      <div className={styles.content}>
        <div className={classNames(styles.loanInfoWrapper, styles.prevLoan)}>
          <h4 className={styles.title}>Current loan</h4>
          <div className={styles.loanStats}>
            {renderColumnValue(
              'Borrowed',
              formatValue(get(loan, 'loanValue', 0), 1e9),
            )}
            {renderColumnValue(
              'Debt',
              formatValue(get(loan, 'repayValue', 0), 1e9),
            )}
            {renderColumnValue(
              'Duration',
              <DurationCell className={styles.duration} loan={loan} />,
              null,
            )}
          </div>
        </div>
        <div className={styles.loanInfoWrapper}>
          <h4 className={styles.title}>New loan</h4>
          <div className={styles.loanStats}>
            {renderColumnValue(
              'Borrowed',
              formatValue(get(bestLoanParams, 'borrowed', 0), 1e9),
            )}
            {renderColumnValue(
              'Debt',
              formatValue(get(bestLoanParams, 'debt', 0), 1e5),
            )}
            {renderColumnValue('Duration', '7 days', null)}
          </div>
        </div>
        <div className={styles.loanDifferenceWrapper}>
          {renderColumnValue(
            negativeDifference
              ? 'Difference you will pay'
              : 'Difference you will receive',
            formatValue(Math.abs(difference), 1e9),
            true,
            negativeDifference && styles.negative,
          )}
        </div>
        <Button
          onClick={(event) => {
            onSubmit();
            event.stopPropagation();
          }}
          type="secondary"
          className={styles.button}
          disabled={!bestLoanParams?.debt || showWarningText}
        >
          {showWarningText ? warningText : 'Extend'}
        </Button>
      </div>
    </Modal>
  );
};

export default RefinanceModal;

const renderColumnValue = (
  label: string,
  value: number | string | JSX.Element,
  postfix = true,
  className = '',
) => (
  <div className={classNames(styles.column, className)}>
    <p className={styles.label}>{label}</p>
    <span className={styles.value}>
      {value}
      {postfix && '◎'}
    </span>
  </div>
);
