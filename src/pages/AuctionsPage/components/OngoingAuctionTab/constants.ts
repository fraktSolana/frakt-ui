const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Buy price', value: 'buyPrice' },
  { label: 'Duration', value: 'duration' },
];

const defaultSortOption = { ...sortOptions[0], value: 'name_asc' };

export { sortOptions, defaultSortOption };
