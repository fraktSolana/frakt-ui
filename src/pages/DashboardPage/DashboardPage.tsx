import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import LendTab from './components/LendTab';

import { useWalletNfts } from '../BorrowPages/BorrowManualPage/hooks';
import { DASHBOARD_TABS, DashboardTabsNames } from './constants';
import DailyActive from './components/DaliyActive';
import TotalStats from './components/TotalStats';
import BorrowTab from './components/BorrowTab';
import { useFetchAllStats } from './hooks';

import styles from './DashboardPage.module.scss';

const DashboardPage: FC = () => {
  const { publicKey: walletPublicKey } = useWallet();

  const { isSuccess } = useWalletNfts();
  const { data } = useFetchAllStats({ walletPublicKey, enabled: isSuccess });

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
          {tabValue === DashboardTabsNames.LEND && <LendTab />}
        </div>
      </div>
      <div className={styles.statsWrapper}>
        <TotalStats data={data?.totalStats} />
        <DailyActive data={data?.dailyActivity} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
