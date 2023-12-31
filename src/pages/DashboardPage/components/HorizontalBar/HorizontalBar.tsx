import { FC } from 'react';

import { Bar } from 'react-chartjs-2';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';

import { options } from './chartOptions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface HorizontalBarProps {
  data: number[];
  labels: string[];
  colors: string[];
  userBalance?: number;
}

const HorizontalBar: FC<HorizontalBarProps> = ({
  labels,
  data: rawData,
  colors,
  userBalance,
}) => {
  const data = {
    labels,
    datasets: [
      {
        barThickness: 20,
        data: rawData,
        rawData: userBalance,
        backgroundColor: colors,
      },
    ],
  };

  return <Bar options={options as unknown} data={data} />;
};

export default HorizontalBar;
