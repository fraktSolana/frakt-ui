import { useState } from 'react';

import { FilterOption } from './FilterDropdown';

export const useFilterDropdown = (defaultOption: FilterOption) => {
  const [filterOption, setFilterOption] = useState(defaultOption);

  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
  };

  return { filterOption, handleFilterChange };
};
