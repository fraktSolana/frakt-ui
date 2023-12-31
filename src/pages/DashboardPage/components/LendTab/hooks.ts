import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { orderBy } from 'lodash';

import { useSolanaBalance } from '@frakt/utils/accounts';
import { useTradePools } from '@frakt/utils/strategies';

import {
  calcWeightedAvaragePoolsApy,
  calcWeightedAvarageStrategiesApy,
  getDepositedUserPools,
  getDepositedUserStrategies,
  getLabelsAndDataByPools,
  getLabelsAndDataByStrategies,
  getTopLiquidityPools,
  getTopStrategies,
  parseLiquidityPoolsData,
  parseStrategiesData,
} from './helpers';
import { useDebounce } from '@frakt/hooks';
import { useMarketsPreview } from '@frakt/pages/MarketsPage/hooks';
import { MarketPreview } from '@frakt/api/bonds';
import { useFetchLiquidityPools } from '@frakt/pages/PoolsPage/hooks';

export const useLendTab = () => {
  const { connected, publicKey } = useWallet();
  const { balance: solanaBalance } = useSolanaBalance();

  const { data: liquidityPools, loading: isLoadingPools } =
    useFetchLiquidityPools({
      walletPublicKey: publicKey,
    });

  const depositedPools = getDepositedUserPools(liquidityPools);
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

  const depositedStrategies = getDepositedUserStrategies(tradePools);
  const topStrategies = getTopStrategies(tradePools);
  const strategies = parseStrategiesData(topStrategies);

  const [strategiesChartData, strategiesChartLabels] =
    getLabelsAndDataByStrategies(tradePools, solanaBalance);

  const weightedAvarageStrategiesApy =
    calcWeightedAvarageStrategiesApy(tradePools);

  //? lend data
  const { marketsPreview } = useMarketsPreview();
  const { markets: filteredMarkets, setSearch } =
    useFilteringMarkets(marketsPreview);

  return {
    poolsData: {
      pools,
      poolsChartData,
      poolsChartLabels,
      apr: weightedAvaragePoolsApy,
      isDepositedAndConnected: !!depositedPools?.length,
    },
    strategiesData: {
      strategies,
      strategiesChartData,
      strategiesChartLabels,
      apr: weightedAvarageStrategiesApy,
      isDepositedAndConnected: !!depositedStrategies?.length,
    },
    lendData: {
      pools: filteredMarkets,
      setSearch,
      isDepositedAndConnected: connected,
      isLoadingPools,
    },
  };
};

export const useFilteringMarkets = (marketsPreview: MarketPreview[]) => {
  const [search, setSearch] = useState<string>('');

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const sortedMarkets = orderBy(
    marketsPreview,
    (market: MarketPreview) => parseFloat(market?.offerTVL),
    'desc',
  );

  const filteredMarkets = sortedMarkets.filter(({ collectionName }) => {
    return collectionName.toUpperCase().includes(search.toUpperCase());
  });

  return {
    markets: filteredMarkets,
    setSearch: setSearchDebounced,
  };
};
