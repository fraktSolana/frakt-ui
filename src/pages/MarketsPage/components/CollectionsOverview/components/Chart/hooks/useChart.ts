import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { selectTheme } from '@frakt/state/theme/selectors';

import { axisOptions, fontTitleOptions } from '../constants';
import {
  getComputedStyleByVaraible,
  renderCertainColorsByData,
} from '../helpers';

export const useChart = () => {
  const theme: string = useSelector(selectTheme);
  const [tooltipBackgroundColor, setTooltipBackgroundColor] =
    useState<string>('');
  const [barBackgroundColor, setBarBackgroundColor] = useState<string>('');

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );

  const options = {
    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        titleFont: fontTitleOptions,
        bodyFont: fontTitleOptions,
        usePointStyle: true,
        callbacks: {
          labelColor: function (context) {
            const isActiveLoansDataset = context?.datasetIndex === 0;

            context.dataset.label = context.dataset.label.toUpperCase();
            if (!isActiveLoansDataset) {
              context.formattedValue = `${context.formattedValue} %`;
            }

            return {
              backgroundColor: isActiveLoansDataset
                ? context.dataset.backgroundColor
                : context.dataset.backgroundColor[context.dataIndex],
              borderRadius: 5,
            };
          },
        },
        backgroundColor: tooltipBackgroundColor,
      },
    },
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

  useEffect(() => {
    const tooltipBackgroundColor =
      getComputedStyleByVaraible('--primary-border');

    const barBackgroundColor = getComputedStyleByVaraible('--blue-color');

    setTooltipBackgroundColor(tooltipBackgroundColor);
    setBarBackgroundColor(barBackgroundColor);
  }, [theme]);

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
        backgroundColor: barBackgroundColor,
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
