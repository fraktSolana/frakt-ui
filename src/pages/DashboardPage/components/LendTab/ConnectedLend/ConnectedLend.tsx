import { FC } from 'react';
import { useSelector } from 'react-redux';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { NavigationButton } from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { DashboardColumnValue } from '../../DashboardStatsValues';
import { ChartValuesList } from '../../ChartPie/ChartValuesList';
import DepositContentView from '../DepositContentView';
import { createChartPieData, getLabelsAndDataByPools } from './helpers';
import { defaultsColors } from './constants';
import { ChartPie } from '../../ChartPie';
import Heading from '../../Heading';

import styles from './ConnectedLend.module.scss';
import { useFetchAllStats } from '@frakt/pages/DashboardPage/hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaBalance } from '@frakt/utils/accounts/useSolanaBalance';

const ConnectedLend: FC = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const { publicKey: walletPublicKey } = useWallet();
  const { data: stats, loading } = useFetchAllStats({ walletPublicKey });
  const { balance } = useSolanaBalance();

  const chartPieData = createChartPieData(stats, balance);

  const [data, labels] = getLabelsAndDataByPools(liquidityPools, balance);

  return (
    <div className={styles.container}>
      <div className={styles.lendContainer}>
        <Heading title="Lend" tooltipText="Lend" />
        <div className={styles.lendContent}>
          <div className={styles.lendStats}>
            <DashboardColumnValue label="valume" value={800} />
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
          data={data}
          labels={labels}
          title="Strategies"
          tooltipText="Strategies"
          buttonText="Manage strategies"
          apr={240}
          path={PATHS.STRATEGIES}
        />
        <DepositContentView
          data={data}
          labels={labels}
          title="Pools"
          tooltipText="Pools"
          buttonText="Manage pools"
          apr={240}
          path={PATHS.LEND}
        />
      </div>
    </div>
  );
};

export default ConnectedLend;
