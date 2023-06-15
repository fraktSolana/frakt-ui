import { RBOption } from '@frakt/components/RadioButton';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

export const DEFAULTS_OPTIONS: RBOption<string>[] = [
  {
    label: 'Sell',
    value: BondFeatures.ReceiveNftOnLiquidation,
  },
  {
    label: 'Receive',
    value: BondFeatures.AutoReceiveAndReceiveNft,
  },
];
