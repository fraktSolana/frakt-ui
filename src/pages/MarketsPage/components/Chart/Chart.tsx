import { FC } from 'react';
import { MarketPreview } from '@frakt/api/bonds';

import ChartWidgets from '../ChartWidgets';
import chartImage from './ChartImage.png';

import styles from './Chart.module.scss';

interface ChartProps {
  marketPreview: MarketPreview;
}

const Chart: FC<ChartProps> = ({ marketPreview }) => {
  return (
    <div className={styles.wrapper}>
      <ChartWidgets marketPreview={marketPreview} />
      <img src={chartImage} className={styles.chart} />
    </div>
  );
};

export default Chart;
