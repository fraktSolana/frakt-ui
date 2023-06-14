import { useState, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { create } from 'zustand';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { MarketPreview } from '@frakt/api/bonds';
import { compareNumbers } from '@frakt/utils';

import { getFilteredMarkets, getMarketsToDisplay } from './helpers';
import { SortValue } from './../FilterSection/DropdownSort';

const useFilteredMarkets = () => {
  const { marketPubkey } = useParams<{ marketPubkey?: string }>();
  const { publicKey } = useWallet();

  const { sortValue, handleSortChange } = useSortState();

  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const { checked, onToggleChange } = useToggleState();
  const { marketsPreview, isLoading } = useMarketsPreview(publicKey, checked);

  const filteredMarkets = getFilteredMarkets(marketsPreview, selectedMarkets);
  const marketsToDisplay = getMarketsToDisplay(
    marketPubkey,
    marketsPreview,
    filteredMarkets,
  );
  const sortedMarkets = useSortMarkets(marketsToDisplay, sortValue);

  const handleFilterChange = (filteredOptions: string[]) => {
    setSelectedMarkets(filteredOptions);
  };

  const isMarketPubkeyPresent = Boolean(marketPubkey);

  return {
    marketsPreview,
    isLoading,
    checked,
    onToggleChange,
    marketsToDisplay: sortedMarkets,
    handleFilterChange,
    isMarketPubkeyPresent,
    handleSortChange,
  };
};

export default useFilteredMarkets;

enum SortField {
  OFFER_TVL = 'offerTVL',
  ACTIVE_LOANS = 'activeLoans',
  APR = 'apr',
}

enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

const useSortMarkets = (
  marketsToDisplay: MarketPreview[],
  sortValue: SortValue,
) => {
  const sortedMarkets = useMemo(() => {
    if (!sortValue) {
      return marketsToDisplay;
    }

    const [name, order] = [sortValue.name, sortValue.order];

    const sorted = [...marketsToDisplay].sort((a, b) => {
      if (name === SortField.OFFER_TVL) {
        return compareNumbers(
          parseFloat(a.offerTVL),
          parseFloat(b.offerTVL),
          order === 'desc',
        );
      }
      if (name === SortField.ACTIVE_LOANS) {
        return compareNumbers(
          a.activeBondsAmount,
          b.activeBondsAmount,
          order === 'desc',
        );
      }
      if (name === SortField.APR) {
        return compareNumbers(a.apy, b.apy, order === 'desc');
      }
    });

    return sorted;
  }, [sortValue, marketsToDisplay]);

  return sortedMarkets;
};

interface ToggleState {
  checked: boolean;
  onToggleChange: () => void;
}

export const useToggleState = create<ToggleState>((set) => ({
  checked: false,
  onToggleChange: () => set((state) => ({ ...state, checked: !state.checked })),
}));

interface SortState {
  sortValue: SortValue;
  handleSortChange: (nextValue: SortValue) => void;
}

export const useSortState = create<SortState>((set) => ({
  sortValue: {
    name: SortField.ACTIVE_LOANS,
    order: SORT_ORDER.DESC,
  },
  handleSortChange: (nextValue) =>
    set((state) => ({ ...state, sortValue: nextValue })),
}));
