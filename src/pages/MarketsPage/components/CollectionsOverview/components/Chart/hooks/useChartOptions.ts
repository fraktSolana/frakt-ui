import { useState, useEffect } from 'react';

import { useTheme } from '@frakt/hooks';
import { MarketHistory } from '@frakt/api/bonds';

import { fontTitleOptions, axisOptions } from '../constants';
import {
  formatTimeToDayAndMonth,
  formatTimeToTooltipData,
  getComputedStyleByVaraible,
} from '../helpers';

export const useChartOptions = (marketHistory: MarketHistory[]) => {
  const { theme } = useTheme();

  const [tooltipBackground, setTooltipBackground] = useState<string>('');

  useEffect(() => {
    const tooltipBackground = getComputedStyleByVaraible('--primary-border');
    setTooltipBackground(tooltipBackground);
  }, [theme]);

  const tooltipOptions = {
    titleFont: fontTitleOptions,
    bodyFont: fontTitleOptions,
    usePointStyle: true,
    callbacks: {
      labelColor: function (context) {
        const isActiveLoansDataset = context?.datasetIndex === 0;

        const labels = marketHistory.map(({ time }) => time);
        const currentData = labels.find(
          (time: string) =>
            formatTimeToDayAndMonth({ time }) === context?.label,
        );

        context.label = formatTimeToTooltipData(currentData).toUpperCase();

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
    backgroundColor: tooltipBackground,
  };

  const legendOptions = { display: false };

  const options = {
    plugins: {
      legend: legendOptions,
      tooltip: tooltipOptions,
    },
    responsive: true,
    scales: {
      xAxes: axisOptions,
      yAxes: axisOptions,
    },
    maintainAspectRatio: false,
    interaction: { mode: 'index' },
  };

  return { options };
};
