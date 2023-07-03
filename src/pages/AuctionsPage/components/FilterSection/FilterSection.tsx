import { FC } from 'react';

import { SortDropdown, Option } from '@frakt/components/SortDropdown';
import { FilterDropdown, FilterOption } from '@frakt/components/FilterDropdown';

import styles from './FilterSection.module.scss';

interface FilterSectionProps {
  sortOptions: Option[];
  sortOption: Option;
  handleSortChange: (option: Option) => void;

  filterOptions: FilterOption[];
  filterOption: FilterOption;
  handleFilterChange: (option: FilterOption) => void;
}

const FilterSection: FC<FilterSectionProps> = ({
  sortOptions,
  sortOption,
  handleSortChange,
  filterOptions,
  filterOption,
  handleFilterChange,
}) => {
  return (
    <div className={styles.filterSectionWrapper}>
      <FilterDropdown
        filterOption={filterOption}
        onFilterChange={handleFilterChange}
        options={filterOptions}
      />
      <SortDropdown
        sortOption={sortOption}
        onSortChange={handleSortChange}
        options={sortOptions}
      />
    </div>
  );
};

export default FilterSection;
