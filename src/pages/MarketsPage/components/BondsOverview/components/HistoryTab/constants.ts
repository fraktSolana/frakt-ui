import { RBOption } from '@frakt/components/RadioButton';

export const HISTORY_FILTER_OPTIONS: RBOption<string>[] = [
  {
    label: 'Repaid',
    value: 'repay',
  },
  {
    label: 'Issued',
    value: 'creation',
  },
  {
    label: 'Liquidated',
    value: 'liquidated',
  },
  {
    label: 'Liquidating',
    value: 'liquidating',
  },
];
