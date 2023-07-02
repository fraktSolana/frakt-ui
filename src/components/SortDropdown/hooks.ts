import { useState } from 'react';

import { Option } from './SortDropdown';

export const useSortDropdown = (defaultOption: Option) => {
  const [sortOption, setSortOption] = useState(defaultOption);

  const handleSortChange = (option: Option) => {
    setSortOption(option);
  };

  return { sortOption, handleSortChange };
};
