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
    colors: {
      text: '#000000',
      background: '#cccccc',
    },
  },
  {
    label: 'Refinance',
    value: FilterValue.Refinance,
    colors: {
      text: '#821FFF',
      background: '#E6D3FE',
    },
  },
  {
    label: 'Liquidate',
    value: FilterValue.Collateral,
    colors: {
      text: '#1F6BFF',
      background: '#d2e1ff',
    },
  },
];

const defaultFilterOption = filterOptions[0];

export { sortOptions, defaultSortOption, filterOptions, defaultFilterOption };
