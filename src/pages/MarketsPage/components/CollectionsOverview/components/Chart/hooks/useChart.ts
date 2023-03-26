import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { renderCertainColorsByData } from '../helpers';
import {
  ACTIVE_LOANS_BACKGROUND_COLOR,
  axisOptions,
  pluginsConfig,
} from '../constants';

export const useChart = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );

  const options = {
    plugins: pluginsConfig,
    responsive: true,
    scales: {
      x: axisOptions,
      y: axisOptions,
    },
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
    },
  };

  const labels = [
    '3/1',
    '3/2',
    '3/3',
    '3/4',
    '3/5',
    '3/6',
    '3/7',
    '3/8',
    '3/9',
    '3/10',
    '3/11',
    '3/12',
    '3/13',
    '3/14',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Active loans',
        data: [
          232, 500, 1000, 750, 340, 200, 156, 545, 678, 789, 845, 911, 654, 700,
        ],
        barPercentage: 1.15,
        backgroundColor: ACTIVE_LOANS_BACKGROUND_COLOR,
      },
      {
        label: 'Highest LTV',
        barPercentage: 1.15,
        data: [0, 40, 80, 23, 55, 76, 90, 100, 95, 77],
        backgroundColor: renderCertainColorsByData([
          0, 40, 80, 23, 55, 76, 90, 100, 95, 77,
        ]),
      },
    ],
  };

  return { options, data };
};
