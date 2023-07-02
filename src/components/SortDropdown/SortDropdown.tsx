import { FC, useState } from 'react';
import classNames from 'classnames';
import { endsWith } from 'lodash';

import { ArrowDownBtn, ArrowUp } from '@frakt/icons';
import Button from '../Button';

import styles from './SortDropdown.module.scss';

export type Option = {
  label: string;
  value: string;
};

interface SortDropdownProps {
  sortOption: Option;
  onSortChange: (option: Option) => void;
  options: Option[];
  className?: string;
}

export const SortDropdown: FC<SortDropdownProps> = ({
  sortOption,
  onSortChange,
  options,
  className,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const renderSortOption = (option: Option, sortOrder: string) => {
    const isActive = sortOption?.value === sortOrder;

    return (
      <Button
        className={classNames(styles.button, { [styles.active]: isActive })}
        type="tertiary"
        onClick={() => onSortChange({ value: sortOrder, label: option.label })}
      >
        {option.label}
        <ArrowUp className={getSortOrderClassName(sortOrder)} />
      </Button>
    );
  };

  return (
    <div className={styles.sortDropdownWrapper}>
      <Button
        className={styles.dropdownButton}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        type="tertiary"
      >
        <span>
          Sort: {sortOption?.label}
          <ArrowUp className={getSortOrderClassName(sortOption.value)} />
        </span>
        <ArrowDownBtn className={open ? styles.rotate : ''} />
      </Button>
      {open && (
        <div className={classNames(styles.dropdown, className)}>
          {options.map(({ label, value }) => (
            <div className={styles.buttons} key={label}>
              {renderSortOption({ label, value }, `${value}_asc`)}
              {renderSortOption({ label, value }, `${value}_desc`)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getSortOrderClassName = (sortOrder: string): string => {
  const isAsc = endsWith(sortOrder, 'asc');
  return isAsc ? styles.rotate : '';
};
