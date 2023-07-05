import Toggle from '@frakt/components/Toggle';
import {
  SortDropdown,
  SortDropdownProps,
} from '@frakt/components/SortDropdown';
import {
  FilterDropdown,
  FilterDropdownProps,
} from '@frakt/components/FilterDropdown';
import {
  // SearchSelect,
  SearchSelectProps,
} from '@frakt/components/SearchSelect';

import styles from './FilterSection.module.scss';

interface FilterSectionProps<T> {
  sortProps: SortDropdownProps;
  filterProps: FilterDropdownProps;
  searchProps: SearchSelectProps<T>;
  toggleProps?: { onChange: () => void; value: boolean };
}

const FilterSection = <T,>({
  sortProps,
  filterProps,
  // searchProps,
  toggleProps,
}: FilterSectionProps<T>) => (
  <div className={styles.container}>
    <div className={styles.searchAndFilterWrapper}>
      {/* <SearchSelect {...searchProps} collapsible /> */}
      <FilterDropdown {...filterProps} />
    </div>
    <div className={styles.sortAndToggleWrapper}>
      {toggleProps && <Toggle label="Mine" />}
      <SortDropdown {...sortProps} />
    </div>
  </div>
);

export default FilterSection;
