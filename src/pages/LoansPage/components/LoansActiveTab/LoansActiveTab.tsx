import { FC } from 'react';
import { Loan } from '@frakt/api/loans';

import { LoansTable } from '../LoansTable';

import styles from './LoansActiveTab.module.scss';
interface LoansActiveTabProps {
  loans: Loan[];
  isLoading: boolean;
}

const LoansActiveTab: FC<LoansActiveTabProps> = ({ loans, isLoading }) => {
  return (
    <LoansTable
      className={styles.loansTable}
      data={loans}
      loading={isLoading}
    />
  );
};

export default LoansActiveTab;
