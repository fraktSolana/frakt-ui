import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { useFetchAllUserBonds } from '@frakt/utils/bonds';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import EmptyList from '@frakt/components/EmptyList';

import { MarketTabsNames, MARKET_TABS, useMarketsPreview } from './hooks';
import { MarketTable } from './components/MarketTable/MarketTable';
import { BondsTable } from '../MarketPage/components/BondsTable';
import BondsWidgets from './components/BondsWidgets';
import styles from './MarketsPage.module.scss';
import { createMyBondsStats } from './helpers';

const MarketsPreviewPage: FC = () => {
  const { publicKey, connected } = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview();

  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: MARKET_TABS, defaultValue: MARKET_TABS[0].value });

  const {
    bonds,
    isLoading: bondsLoanding,
    hideBond,
  } = useFetchAllUserBonds({ walletPubkey: publicKey });

  const { locked, activeLoans } = createMyBondsStats(bonds);

  const loading = isLoading || bondsLoanding;

  return (
    <AppLayout>
      <div className={styles.marketTableWrapper}>
        <h3 className={styles.marketTableTitle}>Collections</h3>
        <MarketTable
          className={classNames(styles.table, styles.marketTable)}
          loading={isLoading}
          data={marketsPreview}
        />
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
                  <BondsWidgets locked={locked} activeLoans={activeLoans} />
                  <BondsTable
                    className={classNames(styles.table, styles.bondsTable)}
                    noDataClassName={styles.noDataTableMessage}
                    loading={loading}
                    data={bonds}
                    haderTitleCellClassName={styles.haderTitleCell}
                    mobileBreakpoint={1190}
                    hideBond={hideBond}
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
    </AppLayout>
  );
};

export default MarketsPreviewPage;
