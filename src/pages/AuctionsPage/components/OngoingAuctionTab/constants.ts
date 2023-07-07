import { ArrowDownLeft, Loop, Shuffle } from '@frakt/icons';
import { FilterOption, FilterValue } from './types';

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'APY', value: 'apy' },
  { label: 'Principle', value: 'principle' },
];

const defaultSortOption = { ...sortOptions[1], value: 'apy_desc' };

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
