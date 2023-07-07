import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

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
  selectedMarkets: string[];
  onFilterChange: (values: string[]) => void;
  handleSortChange: (value: SortValue) => void;
  checked: boolean;
  onToggleChange: () => void;
}

const FilterSection: FC<FilterSectionProps> = ({
  marketsPreview,
  selectedMarkets,
  handleSortChange,
  onToggleChange,
  onFilterChange,
  checked,
}) => {
  const { connected } = useWallet();

  const searchSelectProps: SearchSelectProps<MarketPreview> = {
    options: marketsPreview,
    selectedOptions: selectedMarkets,
    placeholder: 'Select a collection',
    labels: ['Collections', 'APR'],
    optionKeys: {
      labelKey: 'collectionName',
      valueKey: 'marketPubkey',
      imageKey: 'collectionImage',
      secondLabelKey: {
        key: 'apy',
        symbol: '%',
      },
    },
    onFilterChange,
  };

  return (
    <div className={styles.wrapper}>
      <SearchSelect<MarketPreview> {...searchSelectProps} />
      <div className={styles.sortWrapper}>
        {connected && (
          <Toggle label="Mine" value={checked} onChange={onToggleChange} />
        )}
        <DropdownSort onSortChange={handleSortChange} />
      </div>
    </div>
  );
};

export default FilterSection;
