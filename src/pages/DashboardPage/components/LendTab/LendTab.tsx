import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import EmptyList from '@frakt/components/EmptyList';
import { MarketPreview } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';

import { DepositContentView, LendListContentView } from './ContentViews';
import { useFetchAllStats } from '../../hooks';
import MyLendChart from './MyLendChart';
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
          tooltipText="Isolated low-risk lending pools with dynamic interest rate"
          buttonText="Manage pools"
          apr={apr}
          path={PATHS.LEND}
        />
      </>
    ) : (
      <LendListContentView
        data={pools}
        title="Pools"
        tooltipText="Isolated low-risk lending pools with dynamic interest rate"
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
        tooltipText="Lending pools that are controlled by individuals who place and manage offers for you in an automated manner"
        buttonText="Manage strategies"
        apr={apr}
        path={PATHS.STRATEGIES}
      />
    ) : (
      <LendListContentView
        data={strategies}
        title="Strategies"
        tooltipText="Lending pools that are controlled by individuals who place and manage offers for you in an automated manner"
        path={PATHS.STRATEGIES}
      />
    )}
  </>
);

const LendView = ({ isDepositedAndConnected, pools, setSearch }) => {
  const { publicKey: walletPublicKey } = useWallet();
  const { data: stats } = useFetchAllStats({ walletPublicKey });

  const userHasBondsOrOffers =
    stats?.bonds?.activeUserLoans || stats?.bonds?.userOffers;

  return (
    <>
      {isDepositedAndConnected && userHasBondsOrOffers ? (
        <MyLendChart bonds={stats?.bonds} />
      ) : (
        <div className={styles.searchableList}>
          <Search
            title="Lend"
            tooltipText="Place your loan offers for borrowers"
            onChange={setSearch}
            className={styles.search}
          />
          {!pools?.length && (
            <EmptyList
              className={styles.emptyMessage}
              text={'No items found'}
            />
          )}
          {!!pools.length && (
            <div className={styles.nftsList}>
              {pools.map((market: MarketPreview) => (
                <LendCard
                  image={market?.collectionImage}
                  activeLoans={market?.activeBondsAmount}
                  amount={market?.offerTVL}
                  apr={market?.apy}
                  marketPubkey={market?.marketPubkey}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
