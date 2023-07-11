import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { create } from 'zustand';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { useSearchSelectedMarketsURLControl } from '@frakt/hooks';
import { MarketPreview } from '@frakt/api/bonds';
import { compareNumbers } from '@frakt/utils';

import { getFilteredMarkets, getMarketsToDisplay } from '../helpers';
import { SortValue } from '../../FilterSection/DropdownSort';

export const useFilteredMarkets = () => {
  const { publicKey } = useWallet();

  const { sortValue, handleSortChange } = useSortState();

  const { selectedMarkets, setSelectedOptions } =
    useSearchSelectedMarketsURLControl();

  const { checked, onToggleChange } = useToggleState();
  const { marketsPreview, isLoading } = useMarketsPreview(publicKey, checked);

  const filteredMarkets = getFilteredMarkets(marketsPreview, selectedMarkets);
  const marketsToDisplay = getMarketsToDisplay(marketsPreview, filteredMarkets);
  const sortedMarkets = useSortMarkets(marketsToDisplay, sortValue);

  const handleFilterChange = (filteredOptions: string[]) => {
    setSelectedOptions(filteredOptions);
  };

  const showEmptyList = !isLoading && checked && !marketsToDisplay?.length;

  return {
    marketsPreview,
    isLoading,
    checked,
    onToggleChange,
    marketsToDisplay: sortedMarkets,
    handleSortChange,
    showEmptyList,
    handleFilterChange,
    selectedMarkets,
  };
};

enum SortField {
  OFFER_TVL = 'offerTVL',
  LOANS_TVL = 'loansTVL',
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
      if (name === SortField.LOANS_TVL) {
        return compareNumbers(a.loansTVL, b.loansTVL, order === 'desc');
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
    name: SortField.LOANS_TVL,
    order: SORT_ORDER.DESC,
  },
  handleSortChange: (nextValue) =>
    set((state) => ({ ...state, sortValue: nextValue })),
}));
