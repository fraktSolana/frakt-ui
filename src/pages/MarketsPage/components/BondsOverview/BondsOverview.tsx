import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import EmptyList from '@frakt/components/EmptyList';
import Toggle from '@frakt/components/Toggle';

import { MarketTabsNames, useMarketsPage } from './hooks';
import BondsWidgets from './components/BondsWidgets';
import { BondsTable } from './components/BondsTable';
import { createBondsStats } from './helpers';
import { MARKET_TABS } from './constants';

import styles from './BondsOverview.module.scss';

const BondsOverview: FC = () => {
  const { connected } = useWallet();

  const { bonds, loading, hideUserBond } = useMarketsPage();

  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: MARKET_TABS, defaultValue: MARKET_TABS[0].value });

  const { locked, activeLoans } = createBondsStats(bonds);

  return (
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
              <div className={styles.wrapper}>
                <div className={styles.bondsTableHeader}>
                  <BondsWidgets locked={locked} activeLoans={activeLoans} />
                  <Toggle className={styles.toggle} label="My bonds only" />
                </div>
                <BondsTable
                  className={styles.bondsTable}
                  noDataClassName={styles.noDataTableMessage}
                  loading={loading}
                  data={bonds}
                  haderTitleCellClassName={styles.haderTitleCell}
                  breakpoints={{ scrollX: 744 }}
                  hideBond={hideUserBond}
                />
              </div>
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
  );
};

export default BondsOverview;
