import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { defaultsColors } from '../BorrowTab/components/MyLoans/constants';
import styles from './ChartPie.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartPieProps<T> {
  data: T[];
  colors?: string[];
  label?: string;
  value?: number;
  className?: string;
}

export const ChartPie = <T extends unknown>({
  data: rawData,
  colors,
  label,
  value,
  className,
}: ChartPieProps<T>) => {
  const options = { maintainAspectRatio: false };

  const data = {
    datasets: [
      {
        backgroundColor: colors?.length
          ? colors
          : Object.values(defaultsColors),
        borderWidth: 0,
        data: rawData,
      },
    ],
  };

  return (
    <div className={styles.chartWrapper}>
      <Doughnut data={data} options={options} className={className} />
      {!!label && (
        <div className={styles.innerContent}>
          <p className={styles.value}>{value}</p>
          <p className={styles.label}>{label}</p>
        </div>
      )}
    </div>
  );
};
