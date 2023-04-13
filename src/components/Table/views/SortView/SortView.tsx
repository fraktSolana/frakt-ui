import { useRef } from 'react';
import classNames from 'classnames';
import { ColumnsType } from 'antd/es/table';

import { useFiltersModal } from '@frakt/components/FiltersDropdown';
import { useOnClickOutside } from '@frakt/hooks';
import { CardView, TableView } from '@frakt/icons';
import Button from '@frakt/components/Button';

import { Sort, SortDropdown } from '../../components/SortDropdown';
import { Search } from '../../components/Search';
import { useTableView } from './hooks';

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
  const { viewState, setViewState } = useTableView();

  const {
    visible: sortDropdownVisible,
    close: closeDropdown,
    toggle: toggleDropdown,
  } = useFiltersModal();

  const ref = useRef(null);
  useOnClickOutside(ref, closeDropdown);

  return (
    <div className={styles.sortWrapper}>
      <Search
        onChange={search?.onChange}
        className={styles.searchInput}
        placeHolderText={search?.placeHolderText}
      />
      <div className={styles.switchView}>
        <Button
          className={classNames(styles.switchViewButton, {
            [styles.active]: viewState === 'card',
          })}
          onClick={() => setViewState('card')}
          type="tertiary"
        >
          <CardView />
        </Button>
        <Button
          className={classNames(styles.switchViewButton, {
            [styles.active]: viewState === 'table',
          })}
          onClick={() => setViewState('table')}
          type="tertiary"
        >
          <TableView />
        </Button>
      </div>
      <div className={styles.sortingButtonWrapper} ref={ref}>
        <Button
          className={styles.sortingButton}
          type="tertiary"
          onClick={toggleDropdown}
        >
          Sorting
        </Button>
        <SortDropdown
          columns={columns}
          setSort={setSort}
          sort={sort}
          visible={sortDropdownVisible}
        />
      </div>
    </div>
  );
};

export default SortView;
