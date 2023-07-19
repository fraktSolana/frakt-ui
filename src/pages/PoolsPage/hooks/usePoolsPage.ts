import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sumBy } from 'lodash';

import { Option } from '@frakt/components/SortDropdown';

import { useFetchLiquidityPools } from './useFetchLiquidityPools';
import { useSortedPools } from './useSortedPools';

import styles from '../PoolsPage.module.scss';

const defaultSortOption = {
  label: 'Total liquidity',
  value: 'totalLiquidity_desc',
};

export const usePoolsPage = () => {
  const { publicKey: walletPublicKey } = useWallet();

  const { data: liquidityPools, loading } = useFetchLiquidityPools({
    walletPublicKey,
  });

  const [sortOption, setSortOption] = useState<Option>(defaultSortOption);
  const [checkedToggle, setCheckedToggle] = useState<boolean>(false);

  const sortedPools = useSortedPools(liquidityPools, sortOption.value);

  const filteredPools = useMemo(() => {
    if (checkedToggle) {
      return sortedPools.filter((pool) => pool.userDeposit?.depositAmount);
    }

    return sortedPools;
  }, [checkedToggle, sortedPools]);

  return {
    pools: filteredPools,
    loading,

    toggleParams: {
      onChange: setCheckedToggle,
      checked: checkedToggle,
      label: 'Mine',
    },
    sortParams: {
      onChange: setSortOption,
      option: sortOption,
      className: styles.sort,
    },
    totalDeposited: sumBy(
      liquidityPools,
      ({ userDeposit }) => userDeposit?.depositAmount,
    ),
    totalRewards: sumBy(
      liquidityPools,
      ({ userDeposit }) => userDeposit?.harvestAmount,
    ),
  };
};
