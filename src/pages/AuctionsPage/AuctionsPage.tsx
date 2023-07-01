import { AppLayout } from '@frakt/components/Layout/AppLayout';
import TabbedLayout from '@frakt/components/TabbedLayout';
import { useTabs } from '@frakt/components/Tabs';

import OngoingAuctionTab from './components/OngoingAuctionTab';
import { AUCTIONS_TABS as tabs } from './constants';

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
      <TabbedLayout tabs={auctionsTabs} value={tabValue} setValue={setTabValue}>
        {tabValue === AuctionsTabsNames.ONGOING && <OngoingAuctionTab />}
        {/* {tabValue === RafflesTabsNames.UPCOMING && <HistoryActionTab />} */}
      </TabbedLayout>
    </AppLayout>
  );
};

export default AuctionsPage;
