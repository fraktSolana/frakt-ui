import { Tab } from '@frakt/components/Tabs';

export const DASHBOARD_TABS: Tab[] = [
  {
    label: 'Borrow',
    value: 'borrow',
  },
  {
    label: 'Lend',
    value: 'lend',
    disabled: true,
  },
];

export enum DashboardTabsNames {
  BORROW = 'borrow',
  LEND = 'lend',
}
