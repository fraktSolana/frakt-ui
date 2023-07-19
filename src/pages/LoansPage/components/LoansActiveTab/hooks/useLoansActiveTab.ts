import { useEffect, useState } from 'react';
import { find, forEach, groupBy, sumBy } from 'lodash';
import { create } from 'zustand';

import { useFetchAllLoans } from '@frakt/pages/LoansPage/components/LoansActiveTab/hooks';
import { Option } from '@frakt/components/SortDropdown';
import { Loan } from '@frakt/api/loans';

import { useFilteredLoans } from './useFilteredLoans';
import { useSortedLoans } from './useSortedLoans';

const defaultSortOptions = [
  { label: 'Duration', value: 'duration_asc' },
  { label: 'Health', value: 'health_asc' },
];

export const useLoansActiveTab = () => {
  const { loans, isLoading } = useFetchAllLoans();

  const [sortOption, setSortOption] = useState<Option>(defaultSortOptions[0]);

  const { selectedOptions, setSelectedOptions } = useSelectedCollections();

  const { filteredLoans, filteredByDuration, tabsProps } = useFilteredLoans(
    loans,
    selectedOptions,
  );

  useEffect(() => {
    const isPerpetual = tabsProps.value === '0';

    if (isPerpetual) {
      setSortOption(defaultSortOptions[1]);
    } else {
      setSortOption(defaultSortOptions[0]);
    }
  }, [tabsProps.value]);

  const sortedLoans = useSortedLoans(filteredLoans, sortOption?.value);

  return {
    loans: sortedLoans,
    isLoading,
    searchSelectParams: {
      options: getUniqCollectionsWithSumRepayValue(filteredByDuration),
      placeholder: 'Select a collection',
      optionKeys: {
        labelKey: 'collectionName',
        valueKey: 'collectionName',
        imageKey: 'collectionImage',
        secondLabelKey: {
          key: 'debt',
          format: (value: number) => `${(value / 1e9)?.toFixed(2)} ◎`,
        },
      },
      selectedOptions,
      labels: ['Collections', 'Debt'],
      onFilterChange: setSelectedOptions,
    },
    sortParams: {
      onChange: setSortOption,
      option: sortOption,
    },
    tabsProps,
  };
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

const getUniqCollectionsWithSumRepayValue = (
  loans: Loan[],
): { collectionName: string; debt: number }[] => {
  const groupedLoans = groupBy(loans, 'nft.collectionName');

  const collectionSum = [];

  forEach(groupedLoans, (group, collectionName) => {
    const debt = sumBy(group, 'repayValue');
    const collectionImage = find(
      loans,
      (loan: Loan) => loan.nft.collectionName === collectionName,
    ).nft.collectionImage;

    collectionSum.push({ collectionName, debt, collectionImage });
  });

  return collectionSum;
};
