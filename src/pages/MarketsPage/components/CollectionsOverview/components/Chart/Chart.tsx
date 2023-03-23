import { FC } from 'react';
import classNames from 'classnames';

import { MarketPreview } from '@frakt/api/bonds';
import { Loader } from '@frakt/components/Loader';

import ChartWidgets from '../ChartWidgets';
import chartImage from './ChartImage.png';

import styles from './Chart.module.scss';

interface ChartProps {
  isLoading: boolean;
  marketPreview: MarketPreview;
  isVisible: boolean;
}

const Chart: FC<ChartProps> = ({ marketPreview, isLoading, isVisible }) => {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.chartVisible]: isVisible,
      })}
    >
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
