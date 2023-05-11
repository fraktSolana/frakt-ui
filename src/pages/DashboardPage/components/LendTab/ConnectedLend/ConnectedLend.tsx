import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

import { useSolanaBalance } from '@frakt/utils/accounts/useSolanaBalance';
import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { useFetchAllStats } from '@frakt/pages/DashboardPage/hooks';
import { NavigationButton } from '@frakt/components/Button';
import { useTradePools } from '@frakt/utils/strategies';
import { PATHS } from '@frakt/constants';

import { DashboardColumnValue } from '../../DashboardStatsValues';
import { ChartValuesList } from '../../ChartPie/ChartValuesList';
import DepositContentView from '../DepositContentView';
import {
  calcWeightedAvaragePoolsApy,
  calcWeightedAvarageStrategiesApy,
  createChartPieData,
  getLabelsAndDataByPools,
  getLabelsAndDataByStrategies,
} from './helpers';
import { defaultsColors } from './constants';
import { ChartPie } from '../../ChartPie';
import Heading from '../../Heading';

import styles from './ConnectedLend.module.scss';

const ConnectedLend: FC = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const { publicKey: walletPublicKey } = useWallet();

  const { tradePools, isLoading } = useTradePools({
    walletPublicKey: walletPublicKey?.toBase58(),
  });

  const { data: stats, loading } = useFetchAllStats({ walletPublicKey });
  const { balance } = useSolanaBalance();

  const chartPieData = createChartPieData(stats, balance);

  const [strategiesChartData, strategiesChartLabels] =
    getLabelsAndDataByStrategies(tradePools, balance);

  const totalLendAmout =
    stats?.bonds?.bondUserAmount + stats?.bonds?.userOffersAmount;

  const [poolsChartData, poolsChartLabels] = getLabelsAndDataByPools(
    liquidityPools,
    balance,
  );

  const weightedAvaragePoolsApy = calcWeightedAvaragePoolsApy(liquidityPools);
  const weightedAvarageStrategiesApy =
    calcWeightedAvarageStrategiesApy(tradePools);

  return (
    <div className={styles.container}>
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
              value={500}
              className={styles.chart}
              colors={Object.values(defaultsColors)}
            />
            <ChartValuesList data={chartPieData} colors={defaultsColors} />
          </div>
        </div>
        <NavigationButton
          className={styles.navigationButton}
          path={PATHS.BONDS}
        >
          Manage offers
        </NavigationButton>
      </div>
      <div className={styles.depositWrapper}>
        <DepositContentView
          data={strategiesChartData}
          labels={strategiesChartLabels}
          title="Strategies"
          tooltipText="Strategies"
          buttonText="Manage strategies"
          apr={weightedAvarageStrategiesApy}
          path={PATHS.STRATEGIES}
        />
        <DepositContentView
          data={poolsChartData}
          labels={poolsChartLabels}
          title="Pools"
          tooltipText="Pools"
          buttonText="Manage pools"
          apr={weightedAvaragePoolsApy}
          path={PATHS.LEND}
        />
      </div>
    </div>
  );
};

export default ConnectedLend;
