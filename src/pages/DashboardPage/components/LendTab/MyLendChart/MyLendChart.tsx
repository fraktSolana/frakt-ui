import { FC } from 'react';

import { NavigationButton } from '@frakt/components/Button';
import { useSolanaBalance } from '@frakt/utils/accounts';
import { BondsUserStats } from '@frakt/api/user';
import { PATHS } from '@frakt/constants';

import { calcTotalLendAmounts, createChartPieData } from './helpers';
import { DashboardColumnValue } from '../../DashboardStatsValues';
import { ChartValuesList } from '../../ChartPie/ChartValuesList';
import { defaultsColors } from './constants';
import { ChartPie } from '../../ChartPie';
import Heading from '../../Heading';

import styles from './MyLendChart.module.scss';

const MyLendChart: FC<{ bonds: BondsUserStats }> = ({ bonds }) => {
  const { balance } = useSolanaBalance();

  const chartPieData = createChartPieData(bonds, balance);

  const { totalLendAmout, totalLend } = calcTotalLendAmounts(bonds);

  return (
    <div className={styles.lendContainer}>
      <Heading title="Lend" tooltipText="Lend" />
      <div className={styles.lendContent}>
        <div className={styles.lendStats}>
          <DashboardColumnValue label="volume" value={totalLendAmout} />
          {/* <DashboardColumnValue label="pnl" value={80} /> */}
        </div>
        <div className={styles.chartPieWrapper}>
          <ChartPie
            data={chartPieData}
            label="Offers and bonds"
            value={totalLend}
            className={styles.chart}
            colors={Object.values(defaultsColors)}
          />
          <ChartValuesList data={chartPieData} colors={defaultsColors} />
        </div>
      </div>
      <NavigationButton className={styles.navigationButton} path={PATHS.BONDS}>
        Manage offers
      </NavigationButton>
    </div>
  );
};

export default MyLendChart;
