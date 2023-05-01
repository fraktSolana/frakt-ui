import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';

import { fetchBulkSuggestion, fetchMaxBorrowValue } from '@frakt/api/nft';

import { CartOrder, useBorrow } from '../../../cartState';
import { useDebounce } from '@frakt/hooks';
import { LoanType } from '@frakt/api/loans';

export const useBulkForm = () => {
  const wallet = useWallet();
  const { maxBorrowValue, isLoading: maxBorrowValueLoading } =
    useMaxBorrowValue({ walletPublicKey: wallet?.publicKey });
  const {
    cartOrders,
    clearCart,
    clearCurrentNftState,
    setCartState,
    setCurrentNftFromOrder,
  } = useBorrow();

  const [suggestionRequested, setSuggestionRequested] =
    useState<boolean>(false);

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

  const { isLoading: suggestionLoading, refetch: fetchSuggestion } = useQuery(
    ['bulkSuggestion', borrowValue],
    () =>
      fetchBulkSuggestion({
        publicKey: wallet.publicKey,
        totalValue: borrowValue,
      }),
    {
      enabled: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      onSuccess: (bulkSuggestion) => {
        const bestSuggestion = bulkSuggestion?.best || bulkSuggestion?.max;
        if (!bestSuggestion) return;
        clearCart();
        clearCurrentNftState();
        const cartOrders: CartOrder[] = bestSuggestion.orders.map((order) => ({
          borrowNft: order.borrowNft,
          loanType: order.loanType,
          loanValue: order.loanValue,
          bondOrderParams:
            order.loanType === LoanType.BOND
              ? {
                  market: bestSuggestion.markets.find(
                    ({ marketPubkey }) =>
                      marketPubkey ===
                      order?.borrowNft?.bondParams?.marketPubkey,
                  ),
                  orderParams: order.bondOrderParams,
                }
              : null,
        }));

        setCartState({
          orders: cartOrders,
          pairs: bestSuggestion?.modifiedPairs,
        });
      },
    },
  );

  const debouncedRefetch = useDebounce(() => {
    setSuggestionRequested(true);
    fetchSuggestion();
  }, 300);

  useEffect(() => {
    if (parseFloat(borrowValue)) {
      debouncedRefetch();
    }
  }, [borrowValue, debouncedRefetch]);

  useEffect(() => {
    if (suggestionRequested && cartOrders.length && !suggestionLoading) {
      setCurrentNftFromOrder(cartOrders[0]?.borrowNft?.mint);
      setSuggestionRequested(false);
    }
  }, [
    cartOrders,
    suggestionRequested,
    setCurrentNftFromOrder,
    suggestionLoading,
  ]);

  const isNotEnoughBalanceError =
    parseFloat(borrowValue) > parseFloat(maxBorrowValue.toFixed(2));

  return {
    borrowValue,
    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,
    maxBorrowValue,
    loading: maxBorrowValueLoading,
    isNotEnoughBalanceError,
    isWalletConnected: wallet.connected,
    suggestionLoading,
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
