import create from 'zustand';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { axisOptions, pluginsConfig } from './constants';

interface ChartBondsState {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (nextValue: boolean) => void;
}

export const useBondChart = create<ChartBondsState>((set) => ({
  isVisible: false,
  toggleVisibility: () =>
    set((state) => ({ ...state, isVisible: !state.isVisible })),
  setVisibility: (nextValue) =>
    set((state) => ({ ...state, isVisible: nextValue })),
}));

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
        data: [232, 500, 1000],
        backgroundColor: '#007AFF',
      },
      {
        label: 'Highest LTV',
        data: [0, 40, 80],
        backgroundColor: '#FF1F47',
      },
    ],
  };

  return { options, data };
};
