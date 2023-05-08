import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

import { RBOption } from '../../components/RadioButton';
import { OfferTypes } from './types';

export const MAX_LOAN_VALUE = 100;
export const DEFAULT_MAX_LOAN_VALUE_FOR_FLOOR_TYPE_OFFER = 1000;

export const MAX_LIMIT_INTEREST = 5;

export const riskMarks: { [key: string]: string | JSX.Element } = {
  10: '10%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

export const MAX_LIMIT_INTEREST_FOR_7_DAYS = 5;
export const MAX_LIMIT_INTEREST_FOR_14_DAYS = 10;

export const DURATION_OPTIONS: RBOption<number>[] = [
  {
    label: '7 days',
    value: 7,
  },
  {
    label: '14 days',
    value: 14,
  },
];

export const OFFER_TYPE_OPTIONS: RBOption<OfferTypes>[] = [
  {
    label: 'Fixed',
    value: OfferTypes.FIXED,
  },
  {
    label: 'Floor',
    value: OfferTypes.FLOOR,
  },
];

export const EARNER_INTEREST_OPTIONS: RBOption<BondFeatures>[] = [
  {
    label: 'Compound',
    value: BondFeatures.Autocompound,
  },
  {
    label: 'Receive in wallet',
    value: BondFeatures.AutoreceiveSol,
  },
];

export const RECEIVE_OPTIONS: RBOption<BondFeatures>[] = [
  {
    label: 'Liquidate',
    value: BondFeatures.None,
  },
  {
    label: 'Receive in wallet',
    value: BondFeatures.ReceiveNftOnLiquidation,
  },
];
