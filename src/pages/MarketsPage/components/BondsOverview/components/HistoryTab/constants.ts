import { RBOption } from '@frakt/components/RadioButton';

export const HISTORY_FILTER_OPTIONS: RBOption<string>[] = [
  {
    label: 'Repaid',
    value: 'repaid',
  },
  {
    label: 'Liquidating',
    value: 'liquidating',
  },
  {
    label: 'Liquidated',
    value: 'liquidated',
  },
];
