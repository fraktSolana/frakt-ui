import { useLayoutEffect, useRef, useState, FC, useEffect } from 'react';
import { throttle } from 'lodash';

import useD3 from './hooks/useD3';
import { renderChart } from './d3/renderChart';
import { Point } from './types';
import styles from './Chart.module.scss';

interface ChartProps {
  className?: string;
  data: Point[] | null;
}

const Chart: FC<ChartProps> = ({ className, data }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth);
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      setContainerWidth(containerRef.current?.clientWidth);
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        className={`${styles.root} ${className || ''}`}
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
