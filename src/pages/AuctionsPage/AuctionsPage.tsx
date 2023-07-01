import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { useTabs } from '@frakt/components/Tabs';

import OngoingAuctionTab from './components/OngoingAuctionTab';
import { AUCTIONS_TABS } from './constants';

import TabbedLayout from '@frakt/components/TabbedLayout';

export enum AuctionsTabsNames {
  ONGOING = 'ongoing',
  HISTORY = 'history',
}

const AuctionsPage = () => {
  const {
    tabs: auctionsTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: AUCTIONS_TABS,
    defaultValue: AUCTIONS_TABS[0].value,
  });

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
