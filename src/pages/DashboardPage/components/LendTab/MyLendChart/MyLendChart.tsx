import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFetchAllStats } from '@frakt/pages/DashboardPage/hooks';

import { DashboardColumnValue } from '../../DashboardStatsValues';
import { ChartPie } from '../../ChartPie';
import Heading from '../../Heading';

import styles from './MyLendChart.module.scss';
import { calcTotalLendAmounts, createChartPieData } from './helpers';
import { ChartValuesList } from '../../ChartPie/ChartValuesList';
import { NavigationButton } from '@frakt/components/Button';
import { defaultsColors } from './constants';
import { PATHS } from '@frakt/constants';
import { useSolanaBalance } from '@frakt/utils/accounts';

const MyLendChart: FC = () => {
  const { publicKey: walletPublicKey } = useWallet();
  const { balance } = useSolanaBalance();

  const { data: stats } = useFetchAllStats({ walletPublicKey });

  const chartPieData = createChartPieData(stats, balance);

  const { totalLendAmout, totalLend } = calcTotalLendAmounts(stats);

  return (
    <div className={styles.lendContainer}>
      <Heading title="Lend" tooltipText="Lend" />
      <div className={styles.lendContent}>
        <div className={styles.lendStats}>
          <DashboardColumnValue label="volume" value={totalLendAmout} />
          <DashboardColumnValue label="pnl" value={80} />
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
