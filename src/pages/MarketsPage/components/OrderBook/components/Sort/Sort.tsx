import { FC } from 'react';

import { ArrowDownTableSort, ArrowUpTableSort } from '@frakt/icons';
import styles from './Sort.module.scss';

interface SortProps {
  onChangeSort: () => void;
  sort: string;
}

const Sort: FC<SortProps> = ({ onChangeSort, sort }) => {
  return (
    <div className={styles.columnWrapper}>
      <div className={styles.col}>
        <span className={styles.colName}>size</span>
        <span>(SOL)</span>
      </div>
      <div onClick={onChangeSort} className={styles.col}>
        <span className={styles.colName}>Interest</span>
        <span>(%)</span>
        {sort === 'desc' ? <ArrowDownTableSort /> : <ArrowUpTableSort />}
      </div>
    </div>
  );
};

export default Sort;
