import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

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
  );
};

export default BondsOverview;
