import { FC } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { ArrowUp } from '@frakt/icons';

import Button from '../Button';
import styles from './SortOrderButton.module.scss';

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

interface SortOrderButtonProps {
  value: string;
  setValue: any;
  label: JSX.Element;
  sort: { label: JSX.Element; value: string };
}

const SortOrderButton: FC<SortOrderButtonProps> = ({
  value,
  setValue,
  label,
  sort,
}) => {
  const handleClick = (sortOrder: SORT_ORDER) => {
    const sortValue = value + sortOrder;
    setValue('sort', { label, value: sortValue });
  };

  const isSortActive = (sortOrder: SORT_ORDER) =>
    isEqual(sort.value, value + sortOrder);

  return (
    <div className={styles.sortingBtn}>
      {[SORT_ORDER.DESC, SORT_ORDER.ASC].map((sortOrder) => {
        const isActive = isSortActive(sortOrder);

        return (
          <Button
            key={sortOrder}
            type="tertiary"
            className={classNames(styles.filterBtn, {
              [styles.filterBtnActive]: isActive,
            })}
            onClick={() => handleClick(sortOrder)}
          >
            {label}
            <ArrowUp
              className={classNames(styles.icon, {
                [styles.arrowDown]: sortOrder === SORT_ORDER.DESC,
              })}
            />
          </Button>
        );
      })}
    </div>
  );
};

export default SortOrderButton;
