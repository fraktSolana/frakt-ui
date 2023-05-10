import { TradePoolUser } from '@frakt/api/strategies';
import { LiquidityPool } from '@frakt/state/loans/types';

import { LendInfo } from '../types';

const getTopLiquidityPools = (pools: LiquidityPool[]) => {
  return pools
    ?.sort((poolA, poolB) => poolB.totalLiquidity - poolA.totalLiquidity)
    .slice(0, 3);
};

const getTopStrategies = (strategies: TradePoolUser[]) => {
  return strategies
    ?.sort((poolA, poolB) => poolB.totalLiquidity - poolA.totalLiquidity)
    .slice(0, 3);
};

const parseStrategiesData = (strategies: TradePoolUser[] = []): LendInfo[] => {
  return strategies.map((strategy) => {
    return {
      totalLiquidity: (strategy.totalLiquidity / 1e9 || 0)?.toFixed(2),
      depositYield: (strategy?.depositYield || 0)?.toFixed(0),
      image: strategy?.image,
      name: strategy?.name,
    };
  });
};

const parseLiquidityPoolsData = (pools: LiquidityPool[]): LendInfo[] => {
  return pools.map((pool) => {
    return {
      totalLiquidity: (pool.totalLiquidity || 0).toFixed(1),
      depositYield: (pool?.depositApr || 0)?.toFixed(0),
      image: pool?.imageUrl[0],
      name: pool?.name,
    };
  });
};

export {
  getTopLiquidityPools,
  getTopStrategies,
  parseStrategiesData,
  parseLiquidityPoolsData,
};
