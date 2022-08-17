import { FC, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { SORT_VALUES, useLiquidationsPage } from '../Liquidations';
import {
  selectLotteryTickets,
  selectRaffleCollectionsDropdownData,
  selectGraceCollectionsDropdownData,
} from '../../../../state/liquidations/selectors';
import { CollectionDropdown } from '../../../../components/CollectionDropdown';
import { FetchItemsParams } from '../../../../state/liquidations/types';
import { SearchInput } from '../../../../components/SearchInput';
import { Select } from '../../../../components/Select';
import styles from './LiquidationsList.module.scss';
import { TicketsCounter } from '../TicketsCounter';

interface LiquidationsListProps {
  children: ReactNode;
  withRafflesInfo?: boolean;
  fetchItemsFunc?: (params: FetchItemsParams) => void;
}

const LiquidationsList: FC<LiquidationsListProps> = ({
  children,
  withRafflesInfo,
  fetchItemsFunc,
}) => {
  const { control, setSearch, setCollections } =
    useLiquidationsPage(fetchItemsFunc);

  const lotteryTickets = useSelector(selectLotteryTickets);
  const collectionsRaffleListDropdownData = useSelector(
    selectRaffleCollectionsDropdownData,
  );
  const collectionsGraceListDropdownData = useSelector(
    selectGraceCollectionsDropdownData,
  );
  const SORT_COLLECTIONS_VALUES = withRafflesInfo
    ? collectionsRaffleListDropdownData
    : collectionsGraceListDropdownData.map((item) => ({
        label: <span className={styles.sortName}>{item.label}</span>,
        value: item.value,
      }));

  return (
    <>
      <div className={styles.searchWrapper}>
        <SearchInput
          onChange={(event) => setSearch(event.target.value || '')}
          className={styles.searchInput}
          placeholder="Search by name"
        />
        {withRafflesInfo && (
          <div className={styles.rafflesInfo}>
            <TicketsCounter tickets={lotteryTickets.quantity} />
            {/* <TicketsRefillCountdown /> */}
          </div>
        )}
        <div className={styles.sortWrapper}>
          <Controller
            control={control}
            name="collections"
            render={({ field: { ref, ...field } }) => (
              <CollectionDropdown
                className={styles.sortingSelect}
                name="collections"
                options={SORT_COLLECTIONS_VALUES}
                setValues={(evt) => {
                  setCollections(evt);
                }}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="sort"
            render={({ field: { ref, ...field } }) => (
              <Select
                className={styles.sortingSelect}
                valueContainerClassName={styles.sortingSelectValueContainer}
                label="Sort by"
                name="sort"
                options={SORT_VALUES}
                {...field}
              />
            )}
          />
        </div>
      </div>
      {children}
    </>
  );
};

export default LiquidationsList;
