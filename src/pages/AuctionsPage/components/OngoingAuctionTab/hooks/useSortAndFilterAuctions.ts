import { useMemo } from 'react';
import { countBy, filter, find, includes, map } from 'lodash';
import { create } from 'zustand';

import {
  FilterOption,
  useFilterDropdown,
} from '@frakt/components/FilterDropdown';
import { useSortDropdown } from '@frakt/components/SortDropdown';
import { AuctionItem } from '@frakt/api/auctions';
import { compareNumbers } from '@frakt/utils';

import { parseRefinanceAuctionsInfo } from '../../RefinanceAuctionCard';
import {
  FilterValue as AuctionFilterValue,
  SortField,
  SORT_ORDER,
} from '../types';
import {
  defaultFilterOption,
  defaultSortOption,
  filterOptions,
  sortOptions,
} from '../constants';

export const useSortAndFilterAuctions = (auctions: AuctionItem[]) => {
  const { sortOption, handleSortChange } = useSortDropdown(defaultSortOption);
  const { filterOption, handleFilterChange } =
    useFilterDropdown(defaultFilterOption);

  const { selectedOptions, setSelectedOptions } = useSelectedCollections();

  const filteredAuctions = useFilteredAuctions(
    auctions,
    selectedOptions,
    filterOption,
  );

  const sortedAuctions = useSortedAuctions(filteredAuctions, sortOption?.value);

  const countByCollectionName = countBy(auctions, 'nftCollectionName');

  const uniqCollectionNamesWithCountAuctions: {
    collectionName: string;
    auctionsCount: number;
    nftImageUrl: string;
  }[] = map(countByCollectionName, (auctionsCount, collectionName) => {
    const nftImageUrl =
      find(auctions, { nftCollectionName: collectionName })?.nftImageUrl || '';

    return { collectionName, auctionsCount, nftImageUrl };
  });

  const sortedUniqCollectionNamesWithCountAuctions =
    uniqCollectionNamesWithCountAuctions.sort(
      (a, b) => b.auctionsCount - a.auctionsCount,
    );

  return {
    auctions: sortedAuctions,

    sortProps: {
      options: sortOptions,
      onSortChange: handleSortChange,
      sortOption,
    },
    filterProps: {
      options: filterOptions,
      onFilterChange: handleFilterChange,
      filterOption,
    },
    searchProps: {
      options: sortedUniqCollectionNamesWithCountAuctions,
      placeholder: 'Select a collection',
      optionKeys: {
        labelKey: 'collectionName',
        valueKey: 'collectionName',
        imageKey: 'nftImageUrl',
        secondLabelKey: { key: 'auctionsCount' },
      },
      selectedOptions,
      labels: ['Collections', 'Auctions'],
      onFilterChange: setSelectedOptions,
    },
  };
};

const useFilteredAuctions = (
  auctions: AuctionItem[],
  selectedOptions: string[],
  filterOption: FilterOption,
): AuctionItem[] => {
  const filteredByCollectionName = useMemo(() => {
    if (selectedOptions.length) {
      return filter(auctions, (auction) =>
        includes(selectedOptions, auction.nftCollectionName),
      );
    }
    return auctions;
  }, [auctions, selectedOptions]);

  const filteredAuctions = useMemo(() => {
    return filter(filteredByCollectionName, (auction) => {
      const bondParams = auction?.bondParams;
      if (filterOption.value === AuctionFilterValue.Refinance) {
        return bondParams?.auctionRefinanceStartTime;
      }
      if (filterOption.value === AuctionFilterValue.Collateral) {
        return bondParams?.startAuctionTime;
      }
      return auction;
    });
  }, [filteredByCollectionName, filterOption]);

  return filteredAuctions as AuctionItem[];
};

const useSortedAuctions = (
  filteredAuctions: AuctionItem[],
  sortOptionValue: string,
) => {
  const sortedAuctions = useMemo(() => {
    if (!sortOptionValue) {
      return filteredAuctions;
    }

    const [name, order] = sortOptionValue.split('_');

    const sorted = [...filteredAuctions].sort((a, b) => {
      if (name === SortField.NAME) {
        if (order === SORT_ORDER.ASC) {
          return b?.nftName?.localeCompare(a?.nftName);
        }
        return a?.nftName?.localeCompare(b?.nftName);
      }
      if (name === SortField.APY) {
        const { apy: aAPY } = parseRefinanceAuctionsInfo(a) || {};
        const { apy: bAPY } = parseRefinanceAuctionsInfo(b) || {};

        if (!aAPY && !bAPY) return 0;

        if (!aAPY && bAPY) return 1;

        if (aAPY && !bAPY) return -1;

        return compareNumbers(
          parseFloat(aAPY),
          parseFloat(bAPY),
          order === 'desc',
        );
      }
      if (name === SortField.PRINCIPLE) {
        const { newLoanAmount: aNewLoanAmount } =
          parseRefinanceAuctionsInfo(a) || {};

        const { newLoanAmount: bNewLoanAmount } =
          parseRefinanceAuctionsInfo(b) || {};

        if (!aNewLoanAmount && !bNewLoanAmount) return 0;

        if (!aNewLoanAmount && bNewLoanAmount) return 1;

        if (aNewLoanAmount && !bNewLoanAmount) return -1;

        return compareNumbers(aNewLoanAmount, bNewLoanAmount, order === 'desc');
      }
    });

    return sorted;
  }, [sortOptionValue, filteredAuctions]);

  return sortedAuctions;
};

type SelectedCollectionsStore = {
  selectedOptions: string[];
  setSelectedOptions: (value: string[]) => void;
};

const useSelectedCollections = create<SelectedCollectionsStore>((set) => {
  return {
    selectedOptions: [],
    setSelectedOptions: (value) => set(() => ({ selectedOptions: value })),
  };
});
