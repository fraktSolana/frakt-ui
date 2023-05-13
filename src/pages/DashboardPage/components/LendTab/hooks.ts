import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { useSolanaBalance } from '@frakt/utils/accounts';
import { useTradePools } from '@frakt/utils/strategies';

import {
  calcWeightedAvaragePoolsApy,
  calcWeightedAvarageStrategiesApy,
  getLabelsAndDataByPools,
  getLabelsAndDataByStrategies,
  getTopLiquidityPools,
  getTopStrategies,
  parseLiquidityPoolsData,
  parseStrategiesData,
} from './helpers';
import { useDebounce } from '@frakt/hooks';
import { useState } from 'react';

export const useLendTab = () => {
  const { connected, publicKey } = useWallet();
  const { balance: solanaBalance } = useSolanaBalance();

  const liquidityPools = useSelector(selectLiquidityPools);

  const topLiquidityPools = getTopLiquidityPools(liquidityPools);
  const pools = parseLiquidityPoolsData(topLiquidityPools);

  const [poolsChartData, poolsChartLabels] = getLabelsAndDataByPools(
    liquidityPools,
    solanaBalance,
  );
  const weightedAvaragePoolsApy = calcWeightedAvaragePoolsApy(liquidityPools);

  //? strategies data
  const { tradePools } = useTradePools({
    walletPublicKey: publicKey?.toBase58(),
  });

  const topStrategies = getTopStrategies(tradePools);
  const strategies = parseStrategiesData(topStrategies);

  const [strategiesChartData, strategiesChartLabels] =
    getLabelsAndDataByStrategies(tradePools, solanaBalance);

  const weightedAvarageStrategiesApy =
    calcWeightedAvarageStrategiesApy(tradePools);

  //? lend data

  const { pools: filteredPools, setSearch } = useFilteringPools();

  return {
    poolsData: {
      pools,
      poolsChartData,
      poolsChartLabels,
      apr: weightedAvaragePoolsApy,
      isDepositedAndConnected: connected,
    },
    strategiesData: {
      strategies,
      strategiesChartData,
      strategiesChartLabels,
      apr: weightedAvarageStrategiesApy,
      isDepositedAndConnected: connected,
    },
    lendData: {
      pools: filteredPools,
      setSearch,
      isDepositedAndConnected: connected,
    },
  };
};

export const useFilteringPools = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const [search, setSearch] = useState<string>('');

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const filteredPools = liquidityPools.filter(({ name }) => {
    return name.toUpperCase().includes(search.toUpperCase());
  });

  return {
    pools: filteredPools,
    setSearch: setSearchDebounced,
  };
};
