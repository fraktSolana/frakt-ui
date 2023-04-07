import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useHiddenLoansPubkeys } from '@frakt/pages/LoansPage/loansState';
import { useWalletLoans } from '@frakt/pages/LoansPage/hooks';
import { Loan } from '@frakt/api/loans';

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

  return {
    isLoading,
    loans: filteredLoans,
  };
};
