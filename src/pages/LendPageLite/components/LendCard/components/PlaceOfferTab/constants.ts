import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { RBOption } from '@frakt/components/RadioButton';

export const DEFAULTS_OPTIONS: RBOption<string>[] = [
  {
    label: 'Receive NFT',
    value: BondFeatures.AutoReceiveAndReceiveNft,
  },
  {
    label: 'Receive SOL',
    value: BondFeatures.AutoreceiveSol,
  },
];
