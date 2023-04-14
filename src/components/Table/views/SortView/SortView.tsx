import { useRef } from 'react';
import classNames from 'classnames';
import { ColumnsType } from 'antd/es/table';

import { useFiltersModal } from '@frakt/components/FiltersDropdown';
import { CardView, TableView } from '@frakt/icons';
import Checkbox from '@frakt/components/Checkbox';
import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';

import { SortDropdown } from '../../components/SortDropdown';
import { SelectLoansParams, Sort } from '../../types';
import { Search } from '../../components/Search';
import { useTableView } from './hooks';

import styles from './SortView.module.scss';

interface SortViewProps<T> {
  columns: ColumnsType<T>;
  setSort: (nextSort: Sort) => void;
  sort: Sort;
  search: any;
  selectLoansParams?: SelectLoansParams;
  setQueryData: (nextSort: Sort) => void;
}

const SortView = <T extends unknown>({
  columns,
  search,
  setSort,
  sort,
  selectLoansParams,
  setQueryData,
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
      <div className={styles.searchWrapper}>
        {selectLoansParams?.onChange && (
          <Checkbox
            className={styles.checkbox}
            classNameInnerContent={styles.checkboxInnerContent}
            onChange={selectLoansParams.onChange}
            checked={selectLoansParams.selected}
          />
        )}
        <Search
          onChange={search?.onChange}
          className={styles.searchInput}
          placeHolderText={search?.placeHolderText}
        />
      </div>
      <div className={styles.rowGap}>
        <div className={styles.switchButtons}>
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
        <div ref={ref}>
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
            setQueryData={setQueryData}
          />
        </div>
      </div>
    </div>
  );
};

export default SortView;
