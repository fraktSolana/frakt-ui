import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import { SearchInput } from '@frakt/components/SearchInput';
import { useDebounce, useOnClickOutside } from '@frakt/hooks';
import { Selected } from '@frakt/icons';

import img from '../../../../StrategiesPage/components/Strategy/mockPreview.jpg';

import styles from './SearchCollection.module.scss';

const SearchCollection: FC = () => {
  const ref = useRef(null);
  const [searchString, setSearchString] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  useOnClickOutside(ref, () => setFocus(false));

  return (
    <div className={styles.searchCollection}>
      <div className={styles.label}>select collections: 0</div>
      <SearchInput
        onChange={(event) => searchDebounced(event.target.value || '')}
        // onClick={() => setFocus(true)}
        onFocus={() => setFocus(true)}
        className={styles.searchInput}
        placeholder="Search by name"
      />

      {focus && (
        <div className={styles.collections} ref={ref}>
          <div className={styles.item}>
            <div
              className={classNames(styles.image, { [styles.selected]: false })}
              style={{ backgroundImage: `url(${img})` }}
            >
              <Selected />
            </div>
            <div className={styles.title}>P2 Farmers Genesis Series</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchCollection;
