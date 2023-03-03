import { FC, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import AdminButton from '../components/AdminButton';
import Titles from '@frakt/components/Titles';
import Strategies from '../components/Strategies';
import { SearchInput } from '@frakt/components/SearchInput';

import { Loader } from '@frakt/components/Loader';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';
import SortControl from '@frakt/components/SortControl';
import { SORT_VALUES, useSearch, useStrategyFiltering } from '../hooks';
import { useAdminTradePools } from '@frakt/utils/strategies';
import { useOnClickOutside } from '@frakt/hooks';

import styles from '../StrategiesPage.module.scss';

const MyStrategiesPage: FC = () => {
  const wallet = useWallet();

  const { tradePoolsAdmin, isLoading } = useAdminTradePools({
    walletPublicKey: wallet?.publicKey?.toBase58(),
  });

  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef(null);
  useOnClickOutside(ref, closeFiltersModal);

  const { filteredData, onChange } = useSearch({
    data: tradePoolsAdmin,
    searchField: 'poolName',
  });

  const { control, filteredTradePools, sort, setValue } = useStrategyFiltering({
    strategies: filteredData,
  });

  return (
    <AppLayout>
      <Titles title="My Strategies" />
      {!isLoading && <AdminButton />}

      <div className={styles.sortWrapper}>
        <SearchInput
          onChange={onChange}
          className={styles.searchInput}
          placeholder="Search by strategy name"
        />
        <div className={styles.filters} ref={ref}>
          <Button type="tertiary" onClick={toggleFiltersModal}>
            Filters
          </Button>
          {filtersModalVisible && (
            <FiltersDropdown
              onCancel={closeFiltersModal}
              className={styles.filtersDropdown}
            >
              <SortControl
                control={control}
                name={'sort'}
                options={SORT_VALUES}
                sort={sort}
                setValue={setValue}
              />
            </FiltersDropdown>
          )}
        </div>
      </div>
      {isLoading && <Loader size="large" />}
      {!isLoading && <Strategies tradePools={filteredTradePools} admin />}
    </AppLayout>
  );
};

export default MyStrategiesPage;
