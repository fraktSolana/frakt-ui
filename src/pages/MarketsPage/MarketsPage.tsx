import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import EmptyList from '@frakt/components/EmptyList';
import Toggle from '@frakt/components/Toggle';

import { useMarketsPage, useMarketsPreview } from './hooks';
import { MarketTable } from './components/MarketTable/MarketTable';
import { BondsTable } from '../MarketPage/components/BondsTable';
import BondsWidgets from './components/BondsWidgets';
import styles from './MarketsPage.module.scss';
import { createBondsStats } from './helpers';
import { MarketTabsNames } from './types';
import { MARKET_TABS } from './constants';
import OrderBook from './components/OrderBook/OrderBook';
import Chart from './components/Chart';

const MarketsPreviewPage: FC = () => {
  const { connected } = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview();
  const {
    bonds,
    loading: bondsLoanding,
    hideUserBond,
    market,
    marketLoading,
    marketPubkey,
  } = useMarketsPage();

  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: MARKET_TABS, defaultValue: MARKET_TABS[0].value });

  const { locked, activeLoans } = createBondsStats(bonds);

  const loading = isLoading || bondsLoanding;

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.marketTableWrapper}>
          <div>
            <h3 className={styles.marketTableTitle}>Collections</h3>
            <MarketTable
              className={classNames(styles.table, styles.marketTable, {
                [styles.collapsedMarketTable]: marketPubkey,
              })}
              loading={isLoading}
              data={marketsPreview}
              breakpoints={{ mobile: 1190, scrollY: 216 }}
              marketPubkey={marketPubkey}
            />
          </div>
          {marketPubkey && (
            <Chart
              marketPreview={marketsPreview.find(
                (market) => market.marketPubkey === marketPubkey,
              )}
            />
          )}
        </div>

        <div className={styles.content}>
          <Tabs
            className={styles.tab}
            tabs={marketTabs}
            value={tabValue}
            setValue={setTabValue}
          />
          <div className={styles.tabContent}>
            {tabValue === MarketTabsNames.BONDS && (
              <>
                {!connected && (
                  <ConnectWalletSection
                    className={styles.emptyList}
                    text="Connect your wallet to see my bonds"
                  />
                )}

                {connected && (
                  <>
                    <div className={styles.bondsTableHeader}>
                      <BondsWidgets locked={locked} activeLoans={activeLoans} />
                      <Toggle label="My bonds only" />
                    </div>
                    <BondsTable
                      className={classNames(styles.table, styles.bondsTable)}
                      noDataClassName={styles.noDataTableMessage}
                      loading={loading}
                      data={bonds}
                      haderTitleCellClassName={styles.haderTitleCell}
                      breakpoints={{ mobile: 1190 }}
                      hideBond={hideUserBond}
                    />
                  </>
                )}

                {connected && !bonds.length && !loading && (
                  <EmptyList
                    className={styles.emptyList}
                    text="You don't have any bonds"
                  />
                )}
              </>
            )}
            {tabValue === MarketTabsNames.HISTORY && <></>}
          </div>
        </div>
        <OrderBook market={market} marketLoading={marketLoading} />
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
