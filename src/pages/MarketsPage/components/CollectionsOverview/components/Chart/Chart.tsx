import { FC } from 'react';
import { MarketPreview } from '@frakt/api/bonds';

import { Loader } from '@frakt/components/Loader';

import ChartWidgets from '../ChartWidgets';
import chartImage from './ChartImage.png';

import styles from './Chart.module.scss';

interface ChartProps {
  isLoading: boolean;
  marketPreview: MarketPreview;
}

const Chart: FC<ChartProps> = ({ marketPreview, isLoading }) => {
  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ChartWidgets marketPreview={marketPreview} />
          <img src={chartImage} className={styles.chart} />
        </>
      )}
    </div>
  );
};

export default Chart;
