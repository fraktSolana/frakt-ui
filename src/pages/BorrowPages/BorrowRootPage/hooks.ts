import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';

import { fetchMaxBorrowValue } from '@frakt/api/nft';
import { PATHS } from '@frakt/constants';

import { useBorrow } from '../cartState';

export const useBorrowRootPage = () => {
  const history = useHistory();
  const wallet = useWallet();
  const { maxBorrowValue, isLoading: maxBorrowValueLoading } =
    useMaxBorrowValue({ walletPublicKey: wallet?.publicKey });
  const { clearCart, clearCurrentNftState } = useBorrow();

  const goToLiteBorrowing = () => history.push(PATHS.BORROW_LITE);

  const [borrowValue, setBorrowValue] = useState<string>('');
  const [borrowPercentValue, setBorrowPercentValue] = useState<number>(0);

  const onBorrowPercentChange = useCallback(
    (nextValue: number) => {
      const depositValue =
        ((nextValue * maxBorrowValue) / 100)?.toFixed(2) || '0';
      setBorrowValue(depositValue);
      setBorrowPercentValue(nextValue);
    },
    [maxBorrowValue],
  );

  const onBorrowValueChange = useCallback(
    (nextValue: string) => {
      setBorrowValue(nextValue);

      const balancePercent = (parseFloat(nextValue) / maxBorrowValue) * 100;

      if (balancePercent > 100) {
        return setBorrowPercentValue(100);
      }
      if (balancePercent < 0) {
        return setBorrowPercentValue(0);
      }

      return setBorrowPercentValue(balancePercent);
    },
    [maxBorrowValue],
  );

  const isNotEnoughBalanceError =
    parseFloat(borrowValue) > parseFloat(maxBorrowValue.toFixed(2));

  const goToBulkSuggestionPage = () =>
    history.push(`${PATHS.BORROW_BULK_SUGGESTION}?borrowValue=${borrowValue}`);

  const goToBorrowManualPage = () => {
    clearCart();
    clearCurrentNftState();
    history.push(PATHS.BORROW_MANUAL);
  };

  return {
    borrowValue,
    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,
    maxBorrowValue,
    loading: maxBorrowValueLoading,
    isNotEnoughBalanceError,
    isWalletConnected: wallet.connected,
    goToBulkSuggestionPage,
    goToBorrowManualPage,
    goToLiteBorrowing,
  };
};

type UseMaxBorrowValue = (props: { walletPublicKey?: web3.PublicKey }) => {
  maxBorrowValue: number;
  isLoading: boolean;
};
export const useMaxBorrowValue: UseMaxBorrowValue = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['maxBorrowValue', walletPublicKey?.toBase58()],
    () =>
      fetchMaxBorrowValue({
        publicKey: walletPublicKey,
      }),
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    maxBorrowValue: data || 0,
    isLoading,
  };
};
