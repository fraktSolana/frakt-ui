import { FC } from 'react';

import {
  SortDropdown,
  useSortDropdown,
  Option,
} from '@frakt/components/SortDropdown';

import styles from './FilterSection.module.scss';

interface FilterSectionProps {
  sortOptions: Option[];
  defaultSortOption: Option;
}

const FilterSection: FC<FilterSectionProps> = ({
  sortOptions,
  defaultSortOption,
}) => {
  const { sortOption, handleSortChange } = useSortDropdown(defaultSortOption);

  return (
    <div className={styles.filterSectionWrapper}>
      <SortDropdown
        sortOption={sortOption}
        onSortChange={handleSortChange}
        options={sortOptions}
      />
    </div>
  );
};

export default FilterSection;
