import { useContext, useEffect } from 'react';

import { useConnection } from '../../hooks';
import { LoansPoolsContext } from './loans.context';
import { LoansContextValues } from './loans.model';

export const useLoans = (): LoansContextValues => {
  const context = useContext(LoansPoolsContext);
  if (context === null) {
    throw new Error('LoansContext not available');
  }
  return context;
};

export const useLoansInitialFetch = (): void => {
  const { loading, loanDataByPoolPublicKey, initialFetch } = useLoans();
  const connection = useConnection();

  useEffect(() => {
    if (!loading && !loanDataByPoolPublicKey.size && connection) {
      initialFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);
};

export const useLoansPolling = (): void => {
  const { isPolling, startPolling, stopPolling } = useLoans();

  useEffect(() => {
    !isPolling && startPolling();

    return () => {
      isPolling && stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling]);
};
