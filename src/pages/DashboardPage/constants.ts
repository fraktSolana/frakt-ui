import { Tab } from '@frakt/components/Tabs';

export const DASHBOARD_TABS: Tab[] = [
  {
    label: 'Borrow',
    value: 'borrow',
  },
  {
    label: 'Lend',
    value: 'lend',
  },
];

export enum DashboardTabsNames {
  BORROW = 'borrow',
  LEND = 'lend',
}
