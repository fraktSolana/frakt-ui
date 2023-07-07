import { useState } from 'react';
import classNames from 'classnames';

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
      <div className={styles.searchAndFilterWrapper}>
        <SearchSelect
          {...searchProps}
          onChangeCollapsed={setCollapsed}
          className={styles.searchSelect}
          collapsed={collapsed}
          collapsible
        />
        {collapsed && <FilterDropdown {...filterProps} />}
      </div>
      <SortDropdown
        className={classNames(styles.sortDropdown, {
          [styles.hidden]: !collapsed,
        })}
        {...sortProps}
      />
    </div>
  );
};

export default FilterSection;
