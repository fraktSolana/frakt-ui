import { FC } from 'react';
import MyLendChart from './MyLendChart';

import { DepositContentView, LendListContentView } from './ContentViews';
import { LiquidityPool } from '@frakt/state/loans/types';
import { PATHS } from '@frakt/constants';

import { useLendTab } from './hooks';
import { LendCard } from '../Cards';
import { Search } from '../Search';

import styles from './LendTab.module.scss';

const LendTab: FC = () => {
  const { poolsData, strategiesData, lendData } = useLendTab();

  return (
    <div className={styles.container}>
      <LendView {...lendData} />
      <div className={styles.content}>
        <DepositStrategiesView {...strategiesData} />
        <DepositPoolsView {...poolsData} />
      </div>
    </div>
  );
};

export default LendTab;

const DepositPoolsView = ({
  pools = [],
  poolsChartData = [],
  poolsChartLabels = [],
  apr,
  isDepositedAndConnected,
}) => (
  <>
    {isDepositedAndConnected ? (
      <>
        <DepositContentView
          data={poolsChartData}
          labels={poolsChartLabels}
          title="Pools"
          tooltipText="Pools"
          buttonText="Manage pools"
          apr={apr}
          path={PATHS.LEND}
        />
      </>
    ) : (
      <LendListContentView
        data={pools}
        title="Pools"
        tooltipText="Pools"
        path={PATHS.LEND}
      />
    )}
  </>
);

const DepositStrategiesView = ({
  strategies = [],
  strategiesChartData = [],
  strategiesChartLabels = [],
  apr,
  isDepositedAndConnected,
}) => (
  <>
    {isDepositedAndConnected ? (
      <DepositContentView
        data={strategiesChartData}
        labels={strategiesChartLabels}
        title="Strategies"
        tooltipText="Strategies"
        buttonText="Manage strategies"
        apr={apr}
        path={PATHS.STRATEGIES}
      />
    ) : (
      <LendListContentView
        data={strategies}
        title="Strategies"
        tooltipText="Strategies"
        path={PATHS.STRATEGIES}
      />
    )}
  </>
);

const LendView = ({ isDepositedAndConnected, pools, setSearch }) => (
  <>
    {isDepositedAndConnected ? (
      <MyLendChart />
    ) : (
      <div className={styles.searchableList}>
        <Search
          title="Lend"
          tooltipText="Lend"
          onChange={setSearch}
          className={styles.search}
        />
        <div className={styles.nftsList}>
          {pools.map((pool: LiquidityPool) => (
            <LendCard
              image={pool.imageUrl?.[0]}
              activeLoans={pool.activeloansAmount}
              amount={pool.totalLiquidity}
              apr={pool.depositApr}
            />
          ))}
        </div>
      </div>
    )}
  </>
);
