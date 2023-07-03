import { FC } from 'react';

import { SortDropdown, Option } from '@frakt/components/SortDropdown';
import {
  FilterDropdown,
  useFilterDropdown,
} from '@frakt/components/FilterDropdown';

import {
  defaultFilterOption,
  filterOptions,
} from '../OngoingAuctionTab/constants';

import styles from './FilterSection.module.scss';

interface FilterSectionProps {
  sortOptions: Option[];
  sortOption: Option;
  handleSortChange: (option: Option) => void;
}

const FilterSection: FC<FilterSectionProps> = ({
  sortOptions,
  sortOption,
  handleSortChange,
}) => {
  const { filterOption, handleFilterChange } =
    useFilterDropdown(defaultFilterOption);

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
