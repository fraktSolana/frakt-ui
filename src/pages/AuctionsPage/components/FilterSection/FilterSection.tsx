import {
  SortDropdown,
  SortDropdownProps,
} from '@frakt/components/SortDropdown';
import {
  FilterDropdown,
  FilterDropdownProps,
} from '@frakt/components/FilterDropdown';
import {
  SearchSelect,
  SearchSelectProps,
} from '@frakt/components/SearchSelect';

import styles from './FilterSection.module.scss';

interface FilterSectionProps<T> {
  sortProps: SortDropdownProps;
  filterProps: FilterDropdownProps;
  searchProps: SearchSelectProps<T>;
}

const FilterSection = <T,>({
  sortProps,
  filterProps,
  searchProps,
}: FilterSectionProps<T>) => (
  <div className={styles.filterSectionWrapper}>
    <SearchSelect {...searchProps} />
    <FilterDropdown {...filterProps} />
    <SortDropdown {...sortProps} />
  </div>
);

export default FilterSection;
