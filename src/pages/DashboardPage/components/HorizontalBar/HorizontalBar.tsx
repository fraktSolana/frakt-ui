import { FC } from 'react';

import { Bar } from 'react-chartjs-2';

interface HorizontalBarProps {
  data: number[];
  labels: string[];
}

export const options = {
  indexAxis: 'y' as const,
  responsive: true,
  plugins: {
    legend: false,
    labels: {
      render: 'percentage',
      showActualPercentages: true,
    },
  },
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
        steps: 10,
        stepSize: 25,
        max: 100,
      },
    },
  },
};

const HorizontalBar: FC<HorizontalBarProps> = ({ data: rawData, labels }) => {
  const data = {
    labels,
    datasets: [
      {
        data: rawData,
        backgroundColor: [
          '#1FAEFF',
          '#1FAEFF',
          '#1FAEFF',
          '#34C759',
          '#FFC01F',
        ],
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default HorizontalBar;
