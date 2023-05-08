import { FC } from 'react';
import classNames from 'classnames';

import { SearchInput } from '@frakt/components/SearchInput';

import styles from './Search.module.scss';

interface SearchProps {
  title?: string;
  className?: string;
  onChange: (value: string) => void;
}

export const Search: FC<SearchProps> = ({ title, onChange, className }) => (
  <div className={classNames(styles.heading, className)}>
    {!!title && <h3 className={styles.title}>{title}</h3>}
    <SearchInput
      type="input"
      onChange={(event) => onChange(event.target.value)}
      className={styles.searchInput}
      placeholder="Search by name"
    />
  </div>
);
