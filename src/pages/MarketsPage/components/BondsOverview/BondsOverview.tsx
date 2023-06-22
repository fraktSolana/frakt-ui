import { FC } from 'react';

import { Tabs, useTabs } from '@frakt/components/Tabs';

import { MarketTabsNames, MARKET_TABS } from './constants';

import styles from './BondsOverview.module.scss';
import HistoryTab from './components/HistoryTab';
import BondsTab from './components/BondsTab';

const BondsOverview: FC = () => {
  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: MARKET_TABS, defaultValue: MARKET_TABS[0].value });

  return (
    <div className={styles.content}>
      <Tabs
        className={styles.tab}
        tabs={marketTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      <div className={styles.tabContent}>
        {tabValue === MarketTabsNames.LOANS && <BondsTab />}
        {tabValue === MarketTabsNames.HISTORY && <HistoryTab />}
      </div>
    </div>
  );
};

export default BondsOverview;
