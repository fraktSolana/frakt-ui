import { FC } from 'react';

import { Loan } from '@frakt/api/loans';

import { LoansHistoryTable } from '../LoansHistoryTable';

import styles from './LoansHistoryTab.module.scss';

interface LoansHistoryTabProps {
  loans: Loan[];
  isLoading: boolean;
}

const LoansHistoryTab: FC<LoansHistoryTabProps> = ({ loans, isLoading }) => {
  return (
    <LoansHistoryTable
      className={styles.rootTable}
      data={loans}
      loading={isLoading}
    />
  );
};

export default LoansHistoryTab;
