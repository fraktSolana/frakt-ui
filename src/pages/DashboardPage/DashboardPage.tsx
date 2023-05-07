import { FC } from 'react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Tabs, useTabs } from '@frakt/components/Tabs';

import { DASHBOARD_TABS, DashboardTabsNames } from './constants';
import BorrowTab from './components/BorrowTab';

import styles from './DashboardPage.module.scss';

const DashboardPage: FC = () => {
  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: DASHBOARD_TABS, defaultValue: DASHBOARD_TABS[0].value });

  return (
    <AppLayout>
      <div className={styles.content}>
        <Tabs
          className={styles.tab}
          tabs={marketTabs}
          value={tabValue}
          setValue={setTabValue}
        />
        <div className={styles.tabContent}>
          {tabValue === DashboardTabsNames.BORROW && <BorrowTab />}
          {tabValue === DashboardTabsNames.LEND && <></>}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
