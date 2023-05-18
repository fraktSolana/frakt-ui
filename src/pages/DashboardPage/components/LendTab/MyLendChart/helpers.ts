import { BondsUserStats } from '@frakt/api/user';

export const createChartPieData = (bonds: BondsUserStats, balance: number) => {
  const userBondsAmount = bonds?.bondUserAmount || 0;
  const useOffersAmount = bonds?.userOffersAmount || 0;

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

export const calcTotalLendAmounts = (bonds: BondsUserStats) => {
  const totalLendAmout = bonds?.bondUserAmount + bonds?.userOffersAmount || 0;
  const totalLend = bonds?.activeUserLoans + bonds?.userOffers || 0;

  return {
    totalLendAmout,
    totalLend,
  };
};
