import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import classNames from 'classnames';

import { MarketPreview } from '@frakt/api/bonds';
import { Loader } from '@frakt/components/Loader';

import { useChart } from './hooks/useChart';
import ChartWidgets from '../ChartWidgets';

import styles from './Chart.module.scss';

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
            <Bar options={options as unknown} data={data as any} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chart;
