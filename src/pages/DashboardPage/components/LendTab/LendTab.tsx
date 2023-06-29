import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import EmptyList from '@frakt/components/EmptyList';
import { Loader } from '@frakt/components/Loader';
import { MarketPreview } from '@frakt/api/bonds';
import { PATHS } from '@frakt/constants';
import {
  useVisibleMarketURLControl,
  useSearchSelectedMarketsURLControl,
} from '@frakt/hooks';

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

const LendView = ({
  isDepositedAndConnected,
  pools,
  setSearch,
  isLoadingPools,
}) => {
  const { publicKey: walletPublicKey } = useWallet();
  const history = useHistory();
  const { data: stats } = useFetchAllStats({ walletPublicKey });

  const userHasBondsOrOffers =
    stats?.bonds?.activeUserLoans || stats?.bonds?.userOffers;

  const { setSelectedOptions } = useSearchSelectedMarketsURLControl();
  const { toggleVisibleCard } = useVisibleMarketURLControl();

  const goToLiteLending = (collectionName: string) => {
    setSelectedOptions([collectionName]);
    toggleVisibleCard(collectionName);

    history.push({
      pathname: PATHS.BONDS_LITE,
      search: `?opened=${collectionName}&collections=${collectionName}`,
    });
  };
  const showEmptyList = !isLoadingPools && !pools?.length;

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
          {showEmptyList && (
            <EmptyList className={styles.emptyMessage} text="No items found" />
          )}
          {isLoadingPools && <Loader />}
          {!!pools.length && (
            <div className={styles.nftsList}>
              {pools.map((market: MarketPreview) => (
                <LendCard
                  key={market?.marketPubkey}
                  image={market?.collectionImage}
                  activeLoans={market?.activeBondsAmount}
                  amount={market?.offerTVL}
                  apr={market?.apy}
                  collectionName={market?.collectionName}
                  onClick={goToLiteLending}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
