import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { useTradePools } from '@frakt/utils/strategies';

import {
  getTopLiquidityPools,
  getTopStrategies,
  parseLiquidityPoolsData,
  parseStrategiesData,
} from './helpers';

export const useNotConnectedLend = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const { publicKey } = useWallet();
  const { tradePools, isLoading } = useTradePools({
    walletPublicKey: publicKey?.toBase58(),
  });

  const topLiquidityPools = getTopLiquidityPools(liquidityPools);
  const pools = parseLiquidityPoolsData(topLiquidityPools);

  const topStrategies = getTopStrategies(tradePools);
  const strategies = parseStrategiesData(topStrategies);

  return { pools, strategies, allLiquidityPools: liquidityPools };
};
