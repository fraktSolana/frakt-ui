import { useFilterDropdown } from '@frakt/components/FilterDropdown';
import { useSortDropdown } from '@frakt/components/SortDropdown';

import { FilterValue } from '../types';
import {
  defaultFilterOption,
  defaultSortOption,
  filterOptions,
  sortOptions,
} from '../constants';

export const useSortAndFilterAuctions = (auctions: any) => {
  const { sortOption, handleSortChange } = useSortDropdown(defaultSortOption);
  const { filterOption, handleFilterChange } =
    useFilterDropdown(defaultFilterOption);

  const filteredData = auctions.filter((auction) => {
    if (filterOption.value === FilterValue.Refinance) {
      return auction?.bondParams?.auctionRefinanceStartTime;
    }
    if (filterOption.value === FilterValue.Collateral) {
      return auction?.bondParams?.startAuctionTime;
    }
    return auction;
  });

  return {
    auctions: filteredData,

    sort: {
      sortOptions,
      sortOption,
      handleSortChange,
    },
    filter: {
      filterOption,
      handleFilterChange,
      filterOptions,
    },
  };
};
