import { TradePoolUser } from '@frakt/api/strategies';
import { sum, map, orderBy } from 'lodash';

import { calcWeightedAverage } from '@frakt/utils';

import { LendInfo } from '../types';
import {
  divideDataByBestAndOthers,
  getChartDataBySpreadedAmouts,
} from './common';

const getDepositedUserStrategies = (
  strategies: TradePoolUser[] = [],
): TradePoolUser[] => {
  const userDeposit = (strategy: TradePoolUser) =>
    strategy?.wallet?.userDeposit;

  const depositedStrategies = strategies?.filter(userDeposit);
  const sortedStrategies = orderBy(depositedStrategies, userDeposit, 'desc');

  return sortedStrategies;
};

const getLabelsAndDataByStrategies = (
  strategies: TradePoolUser[],
  balance: number,
): [number[], string[]] => {
  const userStrategies = getDepositedUserStrategies(strategies);
  const [strategiesWithLargerDepositAmount, othersPools] =
    divideDataByBestAndOthers(userStrategies);

  const labels = createChartLabelsByStrategies(
    strategiesWithLargerDepositAmount,
    othersPools,
  );

  const data = createChartDataByStrategies(
    strategiesWithLargerDepositAmount,
    othersPools,
    balance,
  );

  return [data, labels];
};

const createChartDataByStrategies = (
  bestStrategies: TradePoolUser[],
  othersStrategies: TradePoolUser[],
  balance: number,
) => {
  const mapUserDepositByPools = (pools: TradePoolUser[]) =>
    map(pools, ({ wallet }) => wallet?.userDeposit / 1e9);

  const depositsByBestStrategies = mapUserDepositByPools(bestStrategies);
  const depositsByOthersStrategies = sum(
    mapUserDepositByPools(othersStrategies),
  );

  const data = getChartDataBySpreadedAmouts([
    ...depositsByBestStrategies,
    depositsByOthersStrategies,
    balance,
  ]);

  return data;
};

const createChartLabelsByStrategies = (
  bestStrategies: TradePoolUser[],
  othersStrategies: TradePoolUser[],
) => {
  const defaultWalletLabel = 'idle in wallet';

  const labelsByBestStrategies = bestStrategies.map(
    (pool: TradePoolUser) => pool?.name,
  );
  const labelsByOthersStrategies = othersStrategies?.length ? 'others' : '';

  return [
    ...labelsByBestStrategies,
    labelsByOthersStrategies,
    defaultWalletLabel,
  ].filter((pool) => pool);
};

const calcWeightedAvarageStrategiesApy = (strategies: TradePoolUser[]) => {
  const userStrategies = getDepositedUserStrategies(strategies);
  const amount = map(userStrategies, ({ wallet }) => wallet.userDeposit / 1e9);
  const APRs = map(userStrategies, ({ wallet }) => wallet.userYield);

  const weightedAvarageApy = calcWeightedAverage(amount, APRs);
  return weightedAvarageApy;
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

export {
  getDepositedUserStrategies,
  getLabelsAndDataByStrategies,
  calcWeightedAvarageStrategiesApy,
  getTopStrategies,
  parseStrategiesData,
};
