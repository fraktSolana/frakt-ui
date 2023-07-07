import { AppLayout } from '@frakt/components/Layout/AppLayout';
import TabbedLayout from '@frakt/components/TabbedLayout';
import { useTabs } from '@frakt/components/Tabs';

import HistoryActionsTab from './components/HistoryActionsTab';
import { AUCTIONS_TABS as tabs } from './constants';
import RootHeader from './components/RootHeader';
import OngoingAuctionTab, {
  useFetchAuctionsList,
} from './components/OngoingAuctionTab';

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

  const { data } = useFetchAuctionsList();

  return (
    <AppLayout>
      <RootHeader totalAuctions={data?.length} />
      <TabbedLayout tabs={auctionsTabs} value={tabValue} setValue={setTabValue}>
        {tabValue === AuctionsTabsNames.ONGOING && <OngoingAuctionTab />}
        {tabValue === AuctionsTabsNames.HISTORY && <HistoryActionsTab />}
      </TabbedLayout>
    </AppLayout>
  );
};

export default AuctionsPage;
