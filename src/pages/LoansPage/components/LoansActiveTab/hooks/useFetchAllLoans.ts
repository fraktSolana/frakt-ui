import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';

import { useHiddenLoansPubkeys } from '@frakt/pages/LoansPage/loansState';
import { useWalletLoans } from '@frakt/pages/LoansPage/hooks';
import { Loan, LoanType } from '@frakt/api/loans';

type UseFetchAllLoans = () => {
  isLoading: boolean;
  loans: Loan[];
};

export const useFetchAllLoans: UseFetchAllLoans = () => {
  const wallet = useWallet();

  const { hiddenLoansPubkeys } = useHiddenLoansPubkeys();
  const { loans, isLoading } = useWalletLoans({
    walletPublicKey: wallet.publicKey,
  });

  const filteredLoans = useMemo(() => {
    return loans.filter(({ pubkey }) => !hiddenLoansPubkeys.includes(pubkey));
  }, [hiddenLoansPubkeys, loans]);

  const updatedLoans = useMemo(() => {
    return filteredLoans.map((loan) => {
      const isBondLoan = loan.loanType === LoanType.BOND;
      const isGracePeriod = isBondLoan
        ? checkBondExpired(loan)
        : !!loan?.gracePeriod;

      return { ...loan, isGracePeriod };
    });
  }, [filteredLoans]);

  return {
    isLoading,
    loans: updatedLoans,
  };
};

export const checkBondExpired = (loan: Loan) => {
  const currentTimestamp = moment().unix();
  const bondExpiredAt = loan.bondParams?.expiredAt;
  return bondExpiredAt && bondExpiredAt < currentTimestamp;
};
