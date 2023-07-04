import { FC, useRef, useState } from 'react';
import classNames from 'classnames';

import { useOnClickOutside } from '@frakt/hooks';
import { ArrowDownBtn } from '@frakt/icons';

import Button from '../Button';

import styles from './FilterDropdown.module.scss';

export type FilterOption = {
  label: string;
  value: string;
  icon: FC;
};

interface FilterDropdownProps {
  filterOption: FilterOption;
  onFilterChange: (option: FilterOption) => void;
  options: FilterOption[];
  className?: string;
}

export const FilterDropdown: FC<FilterDropdownProps> = ({
  onFilterChange,
  filterOption,
  className,
  options,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className={styles.filterDropdownWrapper}>
      <DropdownButton
        open={open}
        option={filterOption}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      />
      {open && (
        <div className={classNames(styles.dropdown, className)}>
          {options.map((option) => (
            <Button
              key={option.value}
              onClick={() => onFilterChange(option)}
              className={classNames(styles.button, {
                [styles.active]: option.value === filterOption.value,
              })}
              type="tertiary"
            >
              {option.icon({})}
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const DropdownButton = ({ option, onClick, open }) => (
  <Button className={styles.dropdownButton} onClick={onClick} type="tertiary">
    <span>
      Type: {option.icon({})} {option.label}
    </span>
    <ArrowDownBtn className={open ? styles.rotate : ''} />
  </Button>
);
