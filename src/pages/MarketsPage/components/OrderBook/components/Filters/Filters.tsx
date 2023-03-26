import { FC, useRef } from 'react';
import classNames from 'classnames';

import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';

import styles from './Filters.module.scss';
import { DURATION_OPTIONS as options } from './constants';

interface FiltersProps {
  onSortChange: (nextValue: number) => void;
  duration: number;
  openOffersMobile: boolean;
}

const Filters: FC<FiltersProps> = ({
  onSortChange,
  duration = 30,
  openOffersMobile,
}) => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  return (
    <div
      className={classNames(styles.filters, {
        [styles.active]: openOffersMobile,
      })}
      ref={ref}
    >
      <Button type="tertiary" onClick={toggleFiltersModal}>
        Duration
      </Button>
      {filtersModalVisible && (
        <FiltersDropdown
          onCancel={closeFiltersModal}
          className={styles.filtersDropdown}
        >
          {options.map(({ value, label }) => (
            <Button
              key={value}
              className={classNames(styles.button, {
                [styles.activeButton]: duration === value,
              })}
              type="tertiary"
              onClick={() => onSortChange(value)}
            >
              {label}
            </Button>
          ))}
        </FiltersDropdown>
      )}
    </div>
  );
};

export default Filters;
