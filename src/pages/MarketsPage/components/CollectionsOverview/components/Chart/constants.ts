import { getTooltipBackgroundColor } from './helpers';

const ACTIVE_LOANS_BACKGROUND_COLOR = '#007AFF';

const fontTitleOptions = {
  family: 'Syne',
  size: 12,
};

const fontOptions = {
  fontFamily: 'Chakra Petch',
  size: 10,
};

const axisOptions = {
  ticks: {
    font: fontOptions,
  },
  stacked: true,
};

const pluginsConfig = {
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
    backgroundColor: getTooltipBackgroundColor(),
  },
};

export { pluginsConfig, axisOptions, ACTIVE_LOANS_BACKGROUND_COLOR };
