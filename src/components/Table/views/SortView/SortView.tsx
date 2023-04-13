import { useRef } from 'react';
import classNames from 'classnames';
import { ColumnsType } from 'antd/es/table';

import { useFiltersModal } from '@frakt/components/FiltersDropdown';
import { useOnClickOutside } from '@frakt/hooks';
import { CardView, HorizontalDots, TableView } from '@frakt/icons';
import Button from '@frakt/components/Button';

import { Sort, SortModalMobile } from '../../SortModalMobile';
import styles from './SortView.module.scss';
import { useTableView } from './hooks';
import { Search } from '../../Search';

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
          onClick={toggleModalMobile}
        >
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
