import { FC, useMemo, useState } from 'react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import Titles from '@frakt/components/Titles';
import { SearchInput } from '@frakt/components/SearchInput';
import Strategies from './components/Strategies';

import styles from './StrategiesPage.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader } from '@frakt/components/Loader';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';
import FilterCollections from '@frakt/components/FilterCollections';
import SortControl from '@frakt/components/SortControl';
import {
  FilterFormInputsNames,
  SORT_VALUES,
  useLoansFiltering,
} from '../LoansPage/hooks/useLoansFiltering';
import { useDebounce } from '@frakt/hooks';
import { useTradePools } from '@frakt/utils/strategies/hooks';

const StrategiesPage: FC = () => {
  const wallet = useWallet();
  const { tradePools, isLoading } = useTradePools({
    walletPublicKey: wallet?.publicKey?.toBase58(),
  });

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  // const { control, sort, setSearch, pools, setValue, showStakedOnlyToggle } =
  // useLendingPoolsFiltering();

  const {
    control,
    loans: filteredLoans,
    sortValueOption,
    sort,
    setValue,
  } = useLoansFiltering({
    selectedCollections,
  });

  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredTradePools = useMemo(() => {
    if (tradePools?.length) {
      return tradePools.filter((tradePool) => {
        const tradePoolName = tradePool.poolName;
        return tradePoolName
          ? tradePoolName.toUpperCase().includes(searchString)
          : false;
      });
    }
  }, [tradePools, searchString]);

  return (
    <AppLayout>
      <Titles
        title="Strategies"
        subtitle="Earn instant yield on SOL deposits"
      />
      <div className={styles.sortWrapper}>
        <SearchInput
          onChange={(event) => searchDebounced(event.target.value)}
          className={styles.searchInput}
          placeholder="Search by strategy name"
        />
        <div className={styles.filters}>
          <Button type="tertiary" onClick={toggleFiltersModal}>
            Filters
          </Button>
          {filtersModalVisible && (
            <FiltersDropdown
              onCancel={closeFiltersModal}
              className={styles.filtersDropdown}
            >
              <FilterCollections
                setSelectedCollections={setSelectedCollections}
                selectedCollections={selectedCollections}
                options={sortValueOption}
              />
              <SortControl
                control={control}
                name={FilterFormInputsNames.SORT}
                options={SORT_VALUES}
                sort={sort}
                setValue={setValue}
              />
            </FiltersDropdown>
          )}
        </div>
      </div>

      {isLoading && <Loader size="large" />}
      {!isLoading && <Strategies tradePools={filteredTradePools} />}
    </AppLayout>
  );
};

export default StrategiesPage;
