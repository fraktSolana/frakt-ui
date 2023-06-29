import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';

import SortControl from '@frakt/components/SortControl';
import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';

import styles from './FilterSection.module.scss';

export const DropdownSort = ({ onSortChange }) => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, closeFiltersModal);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: {
        label: <span>Offer TVL</span>,
        value: 'offerTVL_desc',
      },
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const handleSortValueChange = useCallback(
    (_: string, sortValue) => {
      const [name, order] = sortValue.value.split('_');
      onSortChange({ name, order });
      setValue(FilterFormInputsNames.SORT, sortValue);
    },
    [onSortChange, setValue],
  );

  return (
    <div className={styles.filters} ref={ref}>
      <Button type="tertiary" onClick={toggleFiltersModal}>
        Sorting
      </Button>
      {filtersModalVisible && (
        <FiltersDropdown
          onCancel={closeFiltersModal}
          className={styles.filtersDropdown}
        >
          <SortControl
            control={control}
            name={FilterFormInputsNames.SORT}
            options={SORT_VALUES}
            sort={sort}
            setValue={handleSortValueChange}
          />
        </FiltersDropdown>
      )}
    </div>
  );
};

export interface SortValue {
  name: string;
  order: string;
}

enum FilterFormInputsNames {
  SORT = 'sort',
}

const SORT_VALUES = [
  {
    label: <span>Offer TVL</span>,
    value: 'offerTVL_',
  },
  {
    label: <span>Active loans</span>,
    value: 'activeLoans_',
  },
  {
    label: <span>APY</span>,
    value: 'apr_',
  },
];
