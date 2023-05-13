import { UserStats } from '@frakt/api/user';

export const createChartPieData = (stats: UserStats, balance: number) => {
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

export const calcTotalLendAmounts = (stats: UserStats) => {
  const totalLendAmout =
    stats?.bonds?.bondUserAmount + stats?.bonds?.userOffersAmount || 0;
  const totalLend =
    stats?.bonds?.activeUserLoans + stats?.bonds?.userOffers || 0;

  return {
    totalLendAmout,
    totalLend,
  };
};
