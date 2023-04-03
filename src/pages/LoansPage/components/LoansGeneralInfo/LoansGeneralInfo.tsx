import { FC } from 'react';
import { sum, map } from 'lodash';

import { StatsValues } from '@frakt/components/StatsValues';
import { Loan } from '@frakt/api/loans';

import styles from './LoansGeneralInfo.module.scss';

interface LoansGeneralInfoProps {
  allLoans: Loan[];
}

export const LoansGeneralInfo: FC<LoansGeneralInfoProps> = ({ allLoans }) => {
  const totalBorrowed = sum(map(allLoans, ({ loanValue }) => loanValue / 1e9));
  const totalDebt = sum(map(allLoans, ({ repayValue }) => repayValue / 1e9));

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>My Loans</h2>
      <div className={styles.stats}>
        <StatsValues className={styles.values} label={'Total borrowed:'}>
          <StatsValue value={totalBorrowed} />
        </StatsValues>
        <StatsValues className={styles.values} label={'Total Debt:'}>
          <StatsValue value={totalDebt} />
        </StatsValues>
      </div>
    </div>
  );
};

const StatsValue = ({ value }: { value: number }) => (
  <>{value ? value?.toFixed(2) : '--'} SOL</>
);
