import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  defaults,
} from 'chart.js';

import { selectTheme } from '@frakt/state/theme/selectors';

import { useFetchMarketHistory } from './useFetchMarketHistory';
import { useChartOptions } from './useChartOptions';
import {
  getComputedStyleByVaraible,
  getMarketHistoryInfo,
  // renderCertainColorsByData,
} from '../helpers';

defaults.font.family = 'Chakra Petch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const DEFAULT_BAR_BACKGROUND_COLOR = '#007aff';

export const useChart = () => {
  const theme: string = useSelector(selectTheme);
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const { data: marketHistory, loading } = useFetchMarketHistory({
    marketPubkey,
  });

  const { options } = useChartOptions(marketHistory);
  const [barBackground, setBarBackground] = useState<string>(
    DEFAULT_BAR_BACKGROUND_COLOR,
  );

  useEffect(() => {
    const barBackground = getComputedStyleByVaraible('--blue-color');
    setBarBackground(barBackground);
  }, [theme]);

  const data = useMemo(() => {
    if (!loading && !!marketHistory.length) {
      const { labels, activeLoans } = getMarketHistoryInfo(marketHistory);

      return {
        labels,
        datasets: [
          {
            label: 'Active loans',
            data: activeLoans,
            barPercentage: 1.15,
            backgroundColor: barBackground,
          },
          // {
          //   label: 'Highest LTV',
          //   barPercentage: 1.15,
          //   data: [highestLTVs],
          //   backgroundColor: renderCertainColorsByData(highestLTVs),
          // },
        ],
      };
    }
    return { labels: [], datasets: [] };
  }, [marketHistory, loading]);

  return { options, data };
};
