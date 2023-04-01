import { RBOption } from '@frakt/components/RadioButton';

export const HISTORY_FILTER_OPTIONS: RBOption<string>[] = [
  {
    label: 'Issued',
    value: 'creation',
  },
  {
    label: 'Repaid',
    value: 'repay',
  },
  {
    label: 'Liquidated',
    value: 'liquidated',
  },
];
