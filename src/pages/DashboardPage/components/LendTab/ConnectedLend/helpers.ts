import { UserStats } from '@frakt/api/user/types';
import { LiquidityPool } from '@frakt/state/loans/types';
import { sum, map } from 'lodash';

export const getDepositedUserPools = (pools: LiquidityPool[]) => {
  const userDepositedPools = pools.filter(
    (pool) => !!pool?.userDeposit?.depositAmount,
  );

  const sortedUserPools = userDepositedPools.sort(
    (poolA, poolB) =>
      poolB?.userDeposit?.depositAmount - poolA?.userDeposit?.depositAmount,
  );

  return sortedUserPools;
};

const percentage = (partialValue: number, totalValue: number): number => {
  return (partialValue / totalValue) * 100;
};

export const getLabelsAndDataByPools = (
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

const divideDataByBestAndOthers = (data = [], divideBy = 3) => {
  const [poolsWithLargerDepositAmount, othersPools] = [
    data.slice(0, divideBy),
    data.slice(divideBy, data?.length),
  ];

  return [poolsWithLargerDepositAmount, othersPools];
};

const createChartLabelsByPools = (
  bestPools: LiquidityPool[],
  othersPools: LiquidityPool[],
) => {
  const defaultWalletLabel = 'idle in wallet';

  const labelsByBestPools = bestPools.map((pool) => pool?.name);
  const labelsByOthersPools = othersPools?.length ? 'others' : null;

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

  const spreadedAmoutsData = [
    ...userDepositsByBestPools,
    userDepositsByOthersPools,
    balance,
  ];

  const totalAmount = sum(map(spreadedAmoutsData));

  const data = spreadedAmoutsData
    .filter((pool) => pool)
    .map((number) => percentage(number, totalAmount));

  return data;
};

export const createChartPieData = (stats: UserStats, balance: number) => {
  const userBonds = stats?.bonds?.activeUserLoans || 0;
  const useOffers = stats?.bonds?.userOffers || 0;

  const data = [
    {
      name: 'Bonds',
      key: 'bonds',
      value: userBonds,
    },
    {
      name: 'Offers',
      key: 'offers',
      value: useOffers,
    },
    { name: 'IDLE in wallet', key: 'balance', value: balance?.toFixed(2) },
  ];

  return data;
};
