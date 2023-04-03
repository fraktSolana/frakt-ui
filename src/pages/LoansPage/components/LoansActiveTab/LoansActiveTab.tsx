import { FC } from 'react';
import { LoansTable } from '../LoansTable';
import { Loan } from '@frakt/api/loans';

interface LoansActiveTabProps {
  loans: Loan[];
  isLoading: boolean;
}

const LoansActiveTab: FC<LoansActiveTabProps> = ({ loans, isLoading }) => {
  return <LoansTable data={loans} loading={isLoading} />;
};

export default LoansActiveTab;
