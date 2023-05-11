import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { BorrowNft, OrderParamsLite } from '@frakt/api/nft';

import styles from './BorrowForm.module.scss';
import { generateLoanDetails, generateSummary } from './helpers';
import { useBorrowManualLitePage } from '../../BorrowManualLitePage';
import { LoanType } from '@frakt/api/loans';
import { Dictionary } from 'lodash';

interface BorrowFormProps {
  onSubmit: () => void;
  loanType?: LoanType;
  totalBorrowValue: number;
}
export const BorrowForm: FC<BorrowFormProps> = ({
  onSubmit,
  loanType,
  totalBorrowValue,
}) => {
  const { currentNft, cartNfts, orderParamsByMint, getCurrentNftOrderParams } =
    useBorrowManualLitePage();

  return (
    <div className={styles.borrowForm}>
      <div className={styles.borrowFormDetails}>
        <LoanDetails
          currentNft={currentNft}
          orderParamsLite={getCurrentNftOrderParams()}
          loanType={loanType}
        />
      </div>
      <div className={styles.borrowFormSummary}>
        <p className={styles.borrowFormSummaryTitle}>Summary</p>
        <Summary
          nfts={cartNfts}
          orderParamsByMint={orderParamsByMint}
          loanType={loanType}
        />
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

interface SummaryProps {
  nfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>;
  loanType: LoanType;
}

const Summary: FC<SummaryProps> = ({ nfts, orderParamsByMint, loanType }) => {
  const fields = generateSummary({
    nfts,
    orderParamsByMint,
    loanType,
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

interface LoanDetailsProps {
  currentNft: BorrowNft;
  orderParamsLite?: OrderParamsLite;
  loanType: LoanType;
}

const LoanDetails: FC<LoanDetailsProps> = ({
  currentNft,
  orderParamsLite,
  loanType,
}) => {
  if (!currentNft) return null;

  const fields = generateLoanDetails({
    nft: currentNft,
    orderParamsLite,
    loanType,
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
