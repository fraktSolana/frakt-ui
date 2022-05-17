import { useContext, useEffect } from 'react';

import { FraktionContext } from './fraktion.context';
import { FraktionContextType } from './fraktion.model';

export const useFraktion = (): FraktionContextType => {
  const context = useContext(FraktionContext);
  return context;
};

export const useFraktionInitialFetch = (): void => {
  const { loading, vaults, refetch } = useFraktion();

  useEffect(() => {
    if (!loading && !vaults.length) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useFraktionPolling = (): void => {
  const { startPolling, stopPolling } = useFraktion();

  useEffect(() => {
    startPolling();

    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
