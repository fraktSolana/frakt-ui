import { sum, map } from 'lodash';

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

  return data.filter(Boolean).map((number) => percentage(number, totalAmount));
};

export { percentage, divideDataByBestAndOthers, getChartDataBySpreadedAmouts };
