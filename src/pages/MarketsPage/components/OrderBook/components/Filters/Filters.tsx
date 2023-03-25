import { FC, useRef } from 'react';
import classNames from 'classnames';

import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';

import styles from './Filters.module.scss';

interface FiltersProps {
  onSortChange: (nextValue: number) => void;
  duration: number;
  openOffersMobile: boolean;
}

const Filters: FC<FiltersProps> = ({
  onSortChange,
  duration,
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
          <Button
            className={classNames(styles.button, {
              [styles.activeButton]: duration === 14,
            })}
            type="tertiary"
            onClick={() => onSortChange(14)}
          >
            14 days
          </Button>
          <Button
            className={classNames(styles.button, {
              [styles.activeButton]: duration === 7,
            })}
            type="tertiary"
            onClick={() => onSortChange(7)}
          >
            7 days
          </Button>
        </FiltersDropdown>
      )}
    </div>
  );
};

export default Filters;
