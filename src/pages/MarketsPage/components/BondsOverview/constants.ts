import { Tab } from '@frakt/components/Tabs';

export const MARKET_TABS: Tab[] = [
  {
    label: 'My loans',
    value: 'loans',
  },
  {
    label: 'Activity',
    value: 'history',
  },
];

export enum MarketTabsNames {
  HISTORY = 'history',
  LOANS = 'loans',
}
