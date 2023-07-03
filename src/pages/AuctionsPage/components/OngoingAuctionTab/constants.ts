import { ArrowDownLeft } from '@frakt/icons';
import { FilterOption, FilterValue } from './types';

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Buy price', value: 'buyPrice' },
  { label: 'Duration', value: 'duration' },
];

const defaultSortOption = { ...sortOptions[0], value: 'name_asc' };

const filterOptions: FilterOption[] = [
  {
    label: 'All',
    value: FilterValue.All,
    icon: ArrowDownLeft,
  },
  {
    label: 'Refinance',
    value: FilterValue.Refinance,
    icon: ArrowDownLeft,
  },
  {
    label: 'Liquidate',
    value: FilterValue.Collateral,
    icon: ArrowDownLeft,
  },
];

const defaultFilterOption = filterOptions[0];

export { sortOptions, defaultSortOption, filterOptions, defaultFilterOption };
