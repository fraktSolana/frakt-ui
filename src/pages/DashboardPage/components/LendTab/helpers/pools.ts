import { filter, map, orderBy, sum } from 'lodash';

import { LiquidityPool } from '@frakt/state/loans/types';
import { calcWeightedAverage } from '@frakt/utils';

import { LendInfo } from '../types';
import {
  divideDataByBestAndOthers,
  getChartDataBySpreadedAmouts,
} from './common';

const getDepositedUserPools = (pools: LiquidityPool[]) => {
  const depositAmount = (pool: LiquidityPool) =>
    pool?.userDeposit?.depositAmount;

  const userDepositedPools = pools.filter(depositAmount);
  const sortedUserPools = orderBy(userDepositedPools, depositAmount, 'desc');

  return sortedUserPools;
};

const getLabelsAndDataByPools = (
  pools: LiquidityPool[],
  balance: number,
): [number[], string[]] => {
  const userPools = getDepositedUserPools(pools);

  const [poolsWithLargerDepositAmount, othersPools] =
    divideDataByBestAndOthers(userPools);

  const labels = createChartLabelsByPools(
    poolsWithLargerDepositAmount,
    othersPools,
  );

  const data = createChartDataByPools(
    poolsWithLargerDepositAmount,
    othersPools,
    balance,
  );

  return [data, labels];
};

const createChartLabelsByPools = (
  bestPools: LiquidityPool[],
  othersPools: LiquidityPool[],
) => {
  const defaultWalletLabel = 'idle in wallet';

  const labelsByBestPools = bestPools.map((pool: LiquidityPool) => pool?.name);
  const labelsByOthersPools = othersPools?.length ? 'others' : '';

  return [...labelsByBestPools, labelsByOthersPools, defaultWalletLabel].filter(
    (pool) => pool,
  );
};

const createChartDataByPools = (
  bestPools: LiquidityPool[],
  othersPools: LiquidityPool[],
  balance: number,
) => {
  const mapUserDepositByPools = (pools: LiquidityPool[]) =>
    map(pools, ({ userDeposit }) => userDeposit.depositAmount);

  const userDepositsByBestPools = mapUserDepositByPools(bestPools);
  const userDepositsByOthersPools = sum(mapUserDepositByPools(othersPools));

  const data = getChartDataBySpreadedAmouts([
    ...userDepositsByBestPools,
    userDepositsByOthersPools,
    balance,
  ]);

  return data;
};

export const calcWeightedAvaragePoolsApy = (pools: LiquidityPool[]) => {
  const depositAmount = (pool: LiquidityPool) =>
    pool?.userDeposit?.depositAmount;

  const depositedPools = filter(pools, depositAmount);

  const depositedAmountsNumbers = map(depositedPools, depositAmount);
  const depositedAPRsNumbers = map(depositedPools, 'depositApr');

  const weightedAvarageApy = calcWeightedAverage(
    depositedAPRsNumbers,
    depositedAmountsNumbers,
  );

  return weightedAvarageApy;
};

const getTopLiquidityPools = (pools: LiquidityPool[]) => {
  return pools
    ?.sort((poolA, poolB) => poolB.totalLiquidity - poolA.totalLiquidity)
    .slice(0, 3);
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
  getDepositedUserPools,
  getLabelsAndDataByPools,
  getTopLiquidityPools,
  parseLiquidityPoolsData,
};
