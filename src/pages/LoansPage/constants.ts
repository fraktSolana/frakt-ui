import { Tab } from '@frakt/components/Tabs';

export const LOANS_TABS: Tab[] = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'History',
    value: 'history',
    disabled: true,
  },
];

export enum LoansTabsNames {
  HISTORY = 'history',
  ACTIVE = 'active',
}
