import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { RBOption } from '@frakt/components/RadioButton';

export const LOAN_TO_VALUE_RATIO = 100;
export const DURATION_IN_DAYS = 7;

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

export const DEFAULT_BOND_FEATURE = BondFeatures.AutoReceiveAndReceiveNft;
