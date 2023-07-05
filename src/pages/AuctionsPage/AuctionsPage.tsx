import { AppLayout } from '@frakt/components/Layout/AppLayout';
import TabbedLayout from '@frakt/components/TabbedLayout';
import { useTabs } from '@frakt/components/Tabs';

import OngoingAuctionTab from './components/OngoingAuctionTab';
import HistoryActionsTab from './components/HistoryActionsTab';
import { AUCTIONS_TABS as tabs } from './constants';
import RootHeader from './components/RootHeader';

export enum AuctionsTabsNames {
  ONGOING = 'ongoing',
  HISTORY = 'history',
}

const AuctionsPage = () => {
  const {
    tabs: auctionsTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs, defaultValue: tabs[0].value });

  return (
    <AppLayout>
      <RootHeader />
      <TabbedLayout tabs={auctionsTabs} value={tabValue} setValue={setTabValue}>
        {tabValue === AuctionsTabsNames.ONGOING && <OngoingAuctionTab />}
        {tabValue === AuctionsTabsNames.HISTORY && <HistoryActionsTab />}
      </TabbedLayout>
    </AppLayout>
  );
};

export default AuctionsPage;
