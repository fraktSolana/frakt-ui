const pluginsConfig = {
  legend: {
    display: false,
  },
  // tooltip: {
  //   callbacks: {
  //     labelColor: function (context) {
  //       return {
  //         backgroundColor: 'rgb(255, 0, 0)',
  //         borderWidth: 0,
  //         border: 0,
  //         borderRadius: 5,
  //       };
  //     },
  //   },
  // },
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

export { pluginsConfig, fontOptions, axisOptions };
