import { useRef } from 'react';
import { ColumnsType } from 'antd/es/table';

import { useFiltersModal } from '@frakt/components/FiltersDropdown';
import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';

import { Sort, SortModalMobile } from '../../SortModalMobile';
import { Search } from '../../Search';

import styles from './SortView.module.scss';

interface SortViewProps<T> {
  columns: ColumnsType<T>;
  setSort: (nextSort: Sort) => void;
  sort: Sort;
  search: any;
}

const SortView = <T extends unknown>({
  columns,
  search,
  setSort,
  sort,
}: SortViewProps<T>) => {
  const {
    visible: sortModalMobileVisible,
    close: closeModalMobile,
    toggle: toggleModalMobile,
  } = useFiltersModal();

  const ref = useRef(null);
  useOnClickOutside(ref, closeModalMobile);

  return (
    <div className={styles.sortWrapper}>
      <Search
        onChange={search?.onChange}
        className={styles.searchInput}
        placeHolderText={search?.placeHolderText}
      />
      <div ref={ref}>
        <Button type="tertiary" onClick={toggleModalMobile}>
          Sorting
        </Button>
        <SortModalMobile
          columns={columns}
          setSort={setSort}
          sort={sort}
          sortModalMobileVisible={sortModalMobileVisible}
        />
      </div>
    </div>
  );
};

export default SortView;
