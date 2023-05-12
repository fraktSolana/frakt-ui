import { TradePoolUser } from '@frakt/api/strategies';
import { sum, map, filter, orderBy } from 'lodash';

import { LiquidityPool } from '@frakt/state/loans/types';
import { calcWeightedAverage } from '@frakt/utils';
import { UserStats } from '@frakt/api/user/types';

//? common helpers
const percentage = (partialValue: number, totalValue: number): number => {
  return (partialValue / totalValue) * 100;
};

const divideDataByBestAndOthers = (data = [], divideBy = 3) => {
  const [poolsWithLargerDepositAmount, othersPools] = [
    data.slice(0, divideBy),
    data.slice(divideBy, data?.length),
  ];

  return [poolsWithLargerDepositAmount, othersPools];
};

const getChartDataBySpreadedAmouts = (data: number[]) => {
  const totalAmount = sum(map(data)) || 0;

  return data
    .filter((pool) => pool)
    .map((number) => percentage(number, totalAmount));
};

//? pools helpers
const getDepositedUserPools = (pools: LiquidityPool[]) => {
  const depositAmount = (pool) => pool?.userDeposit?.depositAmount;

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

//? chart pie helpers
const createChartPieData = (stats: UserStats, balance: number) => {
  const userBondsAmount = stats?.bonds?.bondUserAmount || 0;
  const useOffersAmount = stats?.bonds?.userOffersAmount || 0;

  const data = [
    {
      name: 'Bonds',
      key: 'bonds',
      value: userBondsAmount,
    },
    {
      name: 'Offers',
      key: 'offers',
      value: useOffersAmount,
    },
    { name: 'IDLE in wallet', key: 'balance', value: balance?.toFixed(2) },
  ];

  return data;
};

//? strategies helpers
const getDepositedUserStrategies = (
  strategies: TradePoolUser[] = [],
): TradePoolUser[] => {
  const userDeposit = (strategy) => strategy?.wallet?.userDeposit;

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
    map(pools, ({ wallet }) => wallet?.userDeposit);

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

export {
  getLabelsAndDataByPools,
  getLabelsAndDataByStrategies,
  createChartPieData,
  calcWeightedAvarageStrategiesApy,
};
