import { FC, ReactNode } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import styles from './ChartPie.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

export const defaultColors = ['#FFC01F', '#1FAEFF', '#1FFF50', '#FF701F'];

interface ChartPieProps {
  rawData?: any[];
  colors?: string[];
  width?: number;
  label?: string;
  value: number;
}

export const ChartPie: FC<ChartPieProps> = ({
  rawData,
  colors,
  width,
  label,
  value,
}) => {
  const options = { maintainAspectRatio: false };

  const data = {
    datasets: [
      {
        data: rawData,
        backgroundColor: colors?.length ? colors : defaultColors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <Doughnut data={data} options={options} width={width} />
      {!!value && (
        <div className={styles.innerContent}>
          <p className={styles.value}>{value}</p>
          <p className={styles.label}>{label}</p>
        </div>
      )}
    </>
  );
};
