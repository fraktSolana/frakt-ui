import { FC } from 'react';
import classNames from 'classnames';

import useD3 from './hooks/useD3';
import { useContainerWidth } from './hooks/useContainerWidth';
import { renderChart } from './d3/renderChart';
import { Point } from './types';
import styles from './Chart.module.scss';

interface ChartProps {
  className?: string;
  data: Point[] | null;
}

const Chart: FC<ChartProps> = ({ className, data }) => {
  const { containerWidth, containerRef } = useContainerWidth();

  const svgRef = useD3(
    renderChart(data, {
      canvasSize: { x: containerWidth, y: 200 },
    }),
    [data, containerWidth],
  );

  return (
    <div className={styles.chartFrame}>
      <div
        id={'chart'}
        ref={containerRef}
        className={classNames(styles.root, className)}
      >
        <p className={styles.title}>Price graph</p>

        {!!data?.length && (
          <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" />
        )}
      </div>
    </div>
  );
};

export default Chart;
