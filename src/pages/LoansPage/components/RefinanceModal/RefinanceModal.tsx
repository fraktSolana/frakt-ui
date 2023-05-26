import { FC } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';

import { Modal } from '@frakt/components/Modal';

import { Button } from '@frakt/components/Button';
import { formatValue } from '@frakt/utils';
import { Loan } from '@frakt/api/loans';

import { DurationCell } from '../LoansActiveTable';

import styles from './RefinanceModal.module.scss';

interface RefinanceModalProps {
  visible: boolean;
  onCancel: () => void;
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
  const difference = loan?.loanValue - bestLoanParams?.borrowed;

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
            'Difference you will pay',
            formatValue(difference, 1e9),
            true,
            difference < 0 && styles.negative,
          )}
        </div>
        <Button onClick={onSubmit} type="secondary" className={styles.button}>
          Extend
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
