import { FC } from 'react';
import { sum, map } from 'lodash';

import { StatsValues } from '@frakt/components/StatsValues';
import { Loan } from '@frakt/api/loans';
import { Solana } from '@frakt/icons';

import styles from './LoansGeneralInfo.module.scss';

interface LoansGeneralInfoProps {
  allLoans: Loan[];
}

export const LoansGeneralInfo: FC<LoansGeneralInfoProps> = ({ allLoans }) => {
  const totalBorrowed = sum(map(allLoans, ({ loanValue }) => loanValue / 1e9));
  const totalDebt = sum(map(allLoans, ({ repayValue }) => repayValue / 1e9));
  const totalLoans = allLoans.length || '--';

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>My Loans</h2>
      <div className={styles.stats}>
        <StatsValues className={styles.values} label="Loans:">
          {totalLoans}
        </StatsValues>
        <StatsValues className={styles.values} label="Borrowed:">
          <SolAmount value={totalBorrowed} />
        </StatsValues>
        <StatsValues className={styles.values} label="Debt:">
          <SolAmount value={totalDebt} />
        </StatsValues>
      </div>
    </div>
  );
};

const SolAmount = ({ value = 0 }) => (
  <span>
    {value ? value?.toFixed(2) : '--'} <Solana />
  </span>
);
