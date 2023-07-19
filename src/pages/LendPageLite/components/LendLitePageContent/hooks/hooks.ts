import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sortBy, get, isFunction } from 'lodash';
import { create } from 'zustand';

import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { useSearchSelectedMarketsURLControl } from '@frakt/hooks';
import { Option } from '@frakt/components/SortDropdown';
import { MarketPreview } from '@frakt/api/bonds';

import { getFilteredMarkets, getMarketsToDisplay } from '../helpers';
import { defaultSortOption, sortOptions } from '../constants';

export const useFilteredMarkets = () => {
  const { publicKey } = useWallet();

  const { selectedMarkets, setSelectedOptions } =
    useSearchSelectedMarketsURLControl();

  const { checked, onToggleChange } = useToggleState();
  const { marketsPreview, isLoading } = useMarketsPreview(publicKey, checked);

  const filteredMarkets = getFilteredMarkets(marketsPreview, selectedMarkets);
  const marketsToDisplay = getMarketsToDisplay(marketsPreview, filteredMarkets);
  const { sortedMarkets, sortParams } = useSortMarkets(marketsToDisplay);

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
    sortParams,
    showEmptyList,
    handleFilterChange,
    selectedMarkets,
  };
};

enum SortField {
  OFFER_TVL = 'offerTVL',
  LOANS_TVL = 'loansTVL',
  ACTIVE_LOANS = 'activeLoans',
  APY = 'apy',
}

const useSortMarkets = (markets: MarketPreview[]) => {
  const [sortOption, setSortOption] = useState<Option>(defaultSortOption);

  const sortOptionValue = sortOption?.value;

  const sortedMarkets = useMemo(() => {
    if (!sortOptionValue) {
      return markets;
    }

    const [name, order] = sortOptionValue.split('_');

    type SortValueGetter = (market: MarketPreview) => string | number;

    const sortValueMapping: Record<SortField, string | SortValueGetter> = {
      [SortField.OFFER_TVL]: (loan: MarketPreview) => {
        return parseFloat(loan.offerTVL) || 0;
      },
      [SortField.LOANS_TVL]: 'loansTVL',
      [SortField.ACTIVE_LOANS]: 'activeBondsAmount',
      [SortField.APY]: 'apy',
    };

    const sorted = sortBy(markets, (loan) => {
      const sortValue = sortValueMapping[name];
      return isFunction(sortValue) ? sortValue(loan) : get(loan, sortValue);
    });

    return order === 'desc' ? sorted.reverse() : sorted;
  }, [sortOptionValue, markets]);

  return {
    sortedMarkets,
    sortParams: {
      option: sortOption,
      onChange: setSortOption,
      options: sortOptions,
    },
  };
};

interface ToggleState {
  checked: boolean;
  onToggleChange: () => void;
}

export const useToggleState = create<ToggleState>((set) => ({
  checked: false,
  onToggleChange: () => set((state) => ({ ...state, checked: !state.checked })),
}));
