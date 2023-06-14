import { FC } from 'react';

import { MarketPreview } from '@frakt/api/bonds';
import Toggle from '@frakt/components/Toggle';
import {
  SearchSelectProps,
  SearchSelect,
} from '@frakt/components/SearchSelect';

import { DropdownSort, SortValue } from './DropdownSort';
import styles from './FilterSection.module.scss';

interface FilterSectionProps {
  marketsPreview: MarketPreview[];
  onFilterChange: (values: string[]) => void;
  handleSortChange: (value: SortValue) => void;
  checked: boolean;
  onToggleChange: () => void;
}

const FilterSection: FC<FilterSectionProps> = ({
  marketsPreview,
  handleSortChange,
  onToggleChange,
  onFilterChange,
  checked,
}) => {
  const searchSelectProps: SearchSelectProps<MarketPreview> = {
    options: marketsPreview,
    placeholder: 'Select a collection',
    optionKeys: {
      labelKey: 'collectionName',
      valueKey: 'marketPubkey',
      imageKey: 'collectionImage',
      secondLabelKey: 'apy',
    },
    onFilterChange: onFilterChange,
  };

  return (
    <div className={styles.wrapper}>
      <SearchSelect<MarketPreview> {...searchSelectProps} />
      <div className={styles.sortWrapper}>
        <Toggle label="Mine" value={checked} onChange={onToggleChange} />
        <DropdownSort onSortChange={handleSortChange} />
      </div>
    </div>
  );
};

export default FilterSection;