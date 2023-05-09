import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { SearchInput } from '@frakt/components/SearchInput';

import Heading from '../Heading';
import styles from './Search.module.scss';

interface SearchProps {
  title?: string;
  tooltipText?: string;
  className?: string;
  onChange: (value: string) => void;
}

export const Search: FC<SearchProps> = ({
  title,
  onChange,
  className,
  tooltipText,
}) => (
  <div className={classNames(styles.heading, className)}>
    <Heading title={title} tooltipText={tooltipText} />
    <SearchInput
      type="input"
      onChange={(event) => onChange(event.target.value)}
      className={styles.searchInput}
      placeholder="Search by name"
    />
  </div>
);
