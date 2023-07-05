import { ArrowDownLeft, Loop, Shuffle } from '@frakt/icons';
import { FilterOption, FilterValue } from './types';

const sortOptions = [
  { label: 'Name', value: 'name' },
  // { label: 'Buy price', value: 'buyPrice' },
];

const defaultSortOption = { ...sortOptions[0], value: 'name_desc' };

const filterOptions: FilterOption[] = [
  {
    label: 'All',
    value: FilterValue.All,
    icon: Shuffle,
  },
  {
    label: 'Refinance',
    value: FilterValue.Refinance,
    icon: Loop,
  },
  {
    label: 'Liquidate',
    value: FilterValue.Collateral,
    icon: ArrowDownLeft,
  },
];

const defaultFilterOption = filterOptions[0];

export { sortOptions, defaultSortOption, filterOptions, defaultFilterOption };
