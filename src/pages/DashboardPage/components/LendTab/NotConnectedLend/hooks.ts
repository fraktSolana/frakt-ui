import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { useTradePools } from '@frakt/utils/strategies';
import { useDebounce } from '@frakt/hooks';

import {
  getTopLiquidityPools,
  getTopStrategies,
  parseLiquidityPoolsData,
  parseStrategiesData,
} from './helpers';

export const useNotConnectedLend = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const { publicKey } = useWallet();
  const { tradePools } = useTradePools({
    walletPublicKey: publicKey?.toBase58(),
  });

  const [search, setSearch] = useState<string>('');

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const topLiquidityPools = getTopLiquidityPools(liquidityPools);
  const pools = parseLiquidityPoolsData(topLiquidityPools);

  const topStrategies = getTopStrategies(tradePools);
  const strategies = parseStrategiesData(topStrategies);

  const filteredPools = liquidityPools.filter(({ name }) => {
    return name.toUpperCase().includes(search.toUpperCase());
  });

  return {
    pools,
    strategies,
    allLiquidityPools: filteredPools,
    setSearch: setSearchDebounced,
  };
};
