import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Button from '@frakt/components/Button';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';
import Tooltip from '@frakt/components/Tooltip';
import { LoanDuration } from '@frakt/api/nft';

import styles from './BorrowForm.module.scss';
import { generateLoanDetails, generateSummary } from './helpers';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  onSubmit: () => void;
  duration?: LoanDuration;
}
export const BorrowForm: FC<BorrowFormProps> = ({
  onSubmit,
  duration = '7',
}) => {
  const { totalBorrowValue } = useBorrowForm({
    duration,
  });

  return (
    <div className={styles.borrowForm}>
      <div className={styles.borrowFormDetails}>
        <LoanDetails />
      </div>
      <div className={styles.borrowFormSummary}>
        <p className={styles.borrowFormSummaryTitle}>Summary</p>
        <Summary />
      </div>
      <div className={styles.borrowFormSubmitBtnWrapper}>
        <Button
          onClick={onSubmit}
          type="secondary"
          className={styles.borrowFormSubmitBtn}
        >
          {`Borrow ${(totalBorrowValue / 1e9).toFixed(2)} SOL`}
        </Button>
      </div>
    </div>
  );
};

const Summary: FC = () => {
  const {
    currentNft,
    currentLoanType,
    currentLoanValue,
    currentBondOrderParams,
    cartOrders,
  } = useBorrow();

  if (!currentNft || !currentLoanType) return null;

  const fields = generateSummary({
    orders: [
      ...cartOrders,
      {
        borrowNft: currentNft,
        loanType: currentLoanType,
        loanValue: currentLoanValue,
        bondOrderParams: currentBondOrderParams,
      },
    ],
    loanType: currentLoanType,
  });

  return (
    <div className={styles.loanDetails}>
      {fields.map(({ label, value, tooltipText }, idx) => (
        <div className={styles.loanDetailsValue} key={idx}>
          <span>
            {label}
            {tooltipText && (
              <Tooltip placement="bottom" trigger="hover" overlay={tooltipText}>
                <QuestionCircleOutlined className={styles.tooltipIcon} />
              </Tooltip>
            )}
          </span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

const LoanDetails: FC = () => {
  const {
    currentNft,
    currentLoanType,
    currentLoanValue,
    currentBondOrderParams,
  } = useBorrow();

  if (!currentNft || !currentLoanType) return null;

  const fields = generateLoanDetails({
    nft: currentNft,
    loanType: currentLoanType,
    loanValue: currentLoanValue,
    bondOrderParams: currentBondOrderParams,
  });

  return (
    <div className={styles.loanDetails}>
      {fields.map(({ label, value, tooltipText }, idx) => (
        <div className={styles.loanDetailsValue} key={idx}>
          <span>
            {label}
            {tooltipText && (
              <Tooltip placement="bottom" trigger="hover" overlay={tooltipText}>
                <QuestionCircleOutlined className={styles.tooltipIcon} />
              </Tooltip>
            )}
          </span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};
