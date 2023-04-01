import { Tab } from '@frakt/components/Tabs';

export const MARKET_TABS: Tab[] = [
  {
    label: 'My bonds',
    value: 'bonds',
  },
  {
    label: 'Activity',
    value: 'history',
  },
];

export enum MarketTabsNames {
  HISTORY = 'history',
  BONDS = 'bonds',
}
