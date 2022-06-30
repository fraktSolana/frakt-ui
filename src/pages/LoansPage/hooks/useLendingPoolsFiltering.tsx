import { useMemo, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { compareNumbers } from '../../../contexts/liquidityPools';
import { LiquidityPool } from '../../../state/loans/types';
import { ArrowDownSmallIcon } from '../../../icons';
import styles from '../LoansPage.module.scss';
import { useDebounce } from '../../../hooks';

type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: PoolsSortValue;
  [FilterFormInputsNames.SHOW_STAKED]: boolean;
};

type PoolsSortValue = {
  label: JSX.Element;
  value: string;
};

enum FilterFormInputsNames {
  SORT = 'sort',
  SHOW_STAKED = 'showStaked',
}

enum SortField {
  NAME = 'name',
  APR = 'apr',
  TOTAL_LIQUIDITY = 'totalLiquidity',
}

type UseLendingPoolsFiltering = (params: {
  liquidityPools: LiquidityPool[];
}) => {
  control: Control<FilterFormFieldsValues>;
  pools: LiquidityPool[];
  setSearch: (value?: string) => void;
};

export const useLendingPoolsFiltering: UseLendingPoolsFiltering = ({
  liquidityPools,
}) => {
  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SHOW_STAKED]: false,
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const sort = watch(FilterFormInputsNames.SORT);
  const showStaked = watch(FilterFormInputsNames.SHOW_STAKED);

  const filteredPools = useMemo(() => {
    if (liquidityPools?.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return liquidityPools
        .filter((pool) => {
          const userStakesInPool = pool?.userDeposit?.depositAmount;
          const removeBecauseUserDoesntStake = showStaked && !userStakesInPool;

          if (removeBecauseUserDoesntStake) return false;

          const poolName = pool.name;
          return poolName.toUpperCase().includes(searchString);
        })
        .sort((poolA, poolB) => {
          if (sortField === SortField.NAME) {
            if (sortOrder === 'asc')
              return poolA.name.localeCompare(poolB.name);
            return poolB.name.localeCompare(poolA.name);
          }
          if (sortField === SortField.APR) {
            return compareNumbers(
              poolA.depositApr,
              poolB.depositApr,
              sortOrder === 'desc',
            );
          }
          if (sortField === SortField.TOTAL_LIQUIDITY) {
            return compareNumbers(
              poolA.totalLiquidity,
              poolB.totalLiquidity,
              sortOrder === 'desc',
            );
          }
          return 0;
        });
    }

    return [];
  }, [liquidityPools, sort, searchString, showStaked]);

  return { control, pools: filteredPools, setSearch: searchDebounced };
};

export const SORT_VALUES: PoolsSortValue[] = [
  {
    label: (
      <span className={styles.sortName}>
        Liquidity
        <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'totalLiquidity_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidity
        <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'totalLiquidity_asc',
  },

  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'name_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'name_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        APR <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'apr_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        APR <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'apr_desc',
  },
];
