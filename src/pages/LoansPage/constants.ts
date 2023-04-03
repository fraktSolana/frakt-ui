import { Tab } from '@frakt/components/Tabs';

export const LOANS_TABS: Tab[] = [
  {
    label: 'Active loans',
    value: 'active',
  },
  {
    label: 'Loans history',
    value: 'history',
  },
];

export enum LoansTabsNames {
  HISTORY = 'history',
  ACTIVE = 'active',
}
