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
  },
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
        steps: 10,
        stepSize: 25,
        max: 100,
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
