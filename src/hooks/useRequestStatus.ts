import { useEffect, useRef } from 'react';

export const usePrevious = (value: unknown): unknown => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useOnFulfilled = (status: string, handler: () => void): void => {
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus === 'PENDING' && status === 'FULFILLED') {
      handler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
};

export const useOnFailed = (status: string, handler: () => void): void => {
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus === 'PENDING' && status === 'FAILED') {
      handler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
};
