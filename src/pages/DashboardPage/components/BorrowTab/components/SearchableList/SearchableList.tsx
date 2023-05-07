import { FC } from 'react';
import { SearchInput } from '@frakt/components/SearchInput';

import NFTsList from '../../../NFTsList';

import styles from './SearchableList.module.scss';

interface SearchableListProps {
  data: any[];
  title?: string;
  onChange?: (value: string) => void;
}
type SearchHeadingProps = Omit<SearchableListProps, 'data'>;

export const SearchHeading: FC<SearchHeadingProps> = ({ title, onChange }) => (
  <div className={styles.heading}>
    <h3 className={styles.title}>{title}</h3>
    <SearchInput
      type="input"
      onChange={(event) => onChange(event.target.value)}
      className={styles.searchInput}
      placeholder="Search by name"
    />
  </div>
);

export const SearchableList: FC<SearchableListProps> = ({
  title,
  data,
  onChange,
}) => (
  <div className={styles.container}>
    <SearchHeading title={title} onChange={onChange} />
    <NFTsList nfts={data} />
  </div>
);
