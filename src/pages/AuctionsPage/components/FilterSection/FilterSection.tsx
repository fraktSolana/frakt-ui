import { useState } from 'react';

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
}: FilterSectionProps<T>) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      <SearchSelect
        {...searchProps}
        onChangeCollapsed={setCollapsed}
        collapsed={collapsed}
      />
      {collapsed && (
        <div className={styles.sortAndFilterWrapper}>
          <FilterDropdown {...filterProps} />
          <SortDropdown className={styles.sortDropdown} {...sortProps} />
        </div>
      )}
    </div>
  );
};

export default FilterSection;
