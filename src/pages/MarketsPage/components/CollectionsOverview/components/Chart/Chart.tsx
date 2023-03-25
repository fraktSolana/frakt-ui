import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import classNames from 'classnames';

import { MarketPreview } from '@frakt/api/bonds';
import { Loader } from '@frakt/components/Loader';

import ChartWidgets from '../ChartWidgets';

import styles from './Chart.module.scss';
import { useChart } from './hooks';

interface ChartProps {
  marketPreview: MarketPreview;
  isLoading: boolean;
  isVisible: boolean;
}

const Chart: FC<ChartProps> = ({ marketPreview, isLoading, isVisible }) => {
  const { options, data } = useChart();
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
          <div className={styles.chart}>
            <Bar options={options} data={data} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chart;
