import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { MarketPreview } from '@frakt/api/bonds';
import { convertAprToApy } from '@frakt/utils';
import Toggle from '@frakt/components/Toggle';
import {
  SearchSelectProps,
  SearchSelect,
} from '@frakt/components/SearchSelect';
import {
  SortDropdown,
  SortDropdownProps,
} from '@frakt/components/SortDropdown';

import styles from './FilterSection.module.scss';

interface FilterSectionProps {
  marketsPreview: MarketPreview[];
  selectedMarkets: string[];
  onFilterChange: (values: string[]) => void;
  checked: boolean;
  onToggleChange: () => void;
  sortParams: SortDropdownProps;
}

const FilterSection: FC<FilterSectionProps> = ({
  marketsPreview,
  selectedMarkets,
  onToggleChange,
  onFilterChange,
  checked,
  sortParams,
}) => {
  const { connected } = useWallet();
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const searchSelectProps: SearchSelectProps<MarketPreview> = {
    options: marketsPreview,
    selectedOptions: selectedMarkets,
    placeholder: 'Select a collection',
    labels: ['Collections', 'APY'],
    optionKeys: {
      labelKey: 'collectionName',
      valueKey: 'marketPubkey',
      imageKey: 'collectionImage',
      secondLabelKey: {
        key: 'apy',
        format: (value: number) =>
          `${convertAprToApy(value / 100 || 0)?.toFixed(0)} %`,
      },
    },
    onFilterChange,
    onChangeCollapsed: setCollapsed,
    collapsed,
  };

  return (
    <div className={styles.wrapper}>
      <SearchSelect<MarketPreview> {...searchSelectProps} />
      {collapsed && (
        <div className={styles.sortWrapper}>
          {connected && (
            <Toggle label="Mine" value={checked} onChange={onToggleChange} />
          )}
          <SortDropdown {...sortParams} />
        </div>
      )}
    </div>
  );
};

export default FilterSection;
