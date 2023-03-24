import { FC } from 'react';
import classNames from 'classnames';
import styles from './Sort.module.scss';
import { ArrowDownTableSort, ArrowUpTableSort } from '@frakt/icons';

interface SortProps {
  openOffersMobile: boolean;
  existSyntheticParams: boolean;
  onChangeSort: () => void;
  sort: string;
}

const Sort: FC<SortProps> = ({
  openOffersMobile,
  existSyntheticParams,
  onChangeSort,
  sort,
}) => {
  return (
    <div
      className={classNames(styles.columnWrapper, {
        [styles.active]: openOffersMobile,
        [styles.create]: existSyntheticParams,
      })}
    >
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
