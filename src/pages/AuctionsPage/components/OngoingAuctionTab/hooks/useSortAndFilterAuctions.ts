import { useMemo } from 'react';
import { useFilterDropdown } from '@frakt/components/FilterDropdown';
import { useSortDropdown } from '@frakt/components/SortDropdown';

import { FilterValue, SortField, SORT_ORDER } from '../types';
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

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      if (filterOption.value === FilterValue.Refinance) {
        return auction.bondParams.auctionRefinanceStartTime;
      }
      if (filterOption.value === FilterValue.Collateral) {
        return auction.bondParams.startAuctionTime;
      }
      return auction;
    });
  }, [auctions, filterOption]);

  const sortedAuctions = useMemo(() => {
    if (!sortOption.value) {
      return filteredAuctions;
    }

    const [name, order] = sortOption.value.split('_');

    const sorted = [...filteredAuctions].sort((a, b) => {
      if (name === SortField.NAME) {
        if (order === SORT_ORDER.ASC) {
          return b?.nftName?.localeCompare(a?.nftName);
        }
        return a?.nftName?.localeCompare(b?.nftName);
      }
    });

    return sorted;
  }, [sortOption, filteredAuctions]);

  return {
    auctions: sortedAuctions,

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
