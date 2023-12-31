const USER_BALANCE_LABEL = 'idle in wallet';

const tooltipOptions = {
  displayColors: false,
  callbacks: {
    labelColor: function (context) {
      const userBalance = context?.dataset?.rawData;
      const targetValue = context?.raw;
      const solAmount = userBalance * (targetValue / 100);

      if (context.label === USER_BALANCE_LABEL) {
        context.formattedValue = `${userBalance?.toFixed(2)} SOL`;
      } else {
        context.formattedValue = `${solAmount?.toFixed(2)} SOL`;
      }

      return {
        borderRadius: 0,
      };
    },
  },
};

export const options = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: false,
    labels: {
      render: 'percentage',
      showActualPercentages: true,
    },
    tooltip: tooltipOptions,
  },
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
        stepSize: 50,
        max: 100,
        callback: function (value) {
          return ((value / this.max) * 100).toFixed(0) + '%';
        },
      },
      barPercentage: 0.1,
    },
    y: {
      ticks: {
        callback: function (value) {
          const characterLimit = 15;
          const label = this.getLabelForValue(value);
          if (label.length >= characterLimit) {
            return (
              label
                .slice(0, label.length)
                .substring(0, characterLimit - 1)
                .trim() + '...'
            );
          }
          return label;
        },
      },
    },
  },
};
