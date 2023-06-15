import { CSSProperties } from 'react';

import { VALUES_TYPES } from '@frakt/components/StatInfo';
import { MarketPreview } from '@frakt/api/bonds';

import { renderDurationButtons } from './components/CollectionsStats';

export const DURATIONS_OPTIONS = [{ label: '7d', value: 7 }];

interface StatInfos {
  label: string;
  key: string;

  valueRenderer?: (market: any) => string | number | JSX.Element;
  secondValue?: (market: MarketPreview) => string;
  tooltipText?: string;
  valueType?: VALUES_TYPES;
  decimalPlaces?: number;
  valueStyles?: CSSProperties;
  divider?: number;
}

export const statInfos: StatInfos[] = [
  {
    key: 'offerTVL',
    label: 'In offers',
    tooltipText: 'Total liquidity currently available in active offers',
    secondValue: (market: MarketPreview) =>
      `in ${market?.activeOfferAmount || 0} offers`,
  },
  {
    key: 'loansTVL',
    label: 'Taken',
    tooltipText: 'Liquidity that is locked in active loans',
    secondValue: (market: MarketPreview) =>
      `in ${market?.activeBondsAmount || 0} loans`,
    divider: 1e9,
  },
  {
    key: 'duration',
    label: 'Duration',
    valueRenderer: (duration: number[]) => renderDurationButtons(duration),
    valueType: VALUES_TYPES.string,
  },
  {
    key: 'apy',
    label: 'Apr',
    tooltipText: 'Interest (in %) for the duration of this loan',
    valueRenderer: (apr: number) => apr?.toFixed(0),
    valueType: VALUES_TYPES.percent,
    decimalPlaces: 0,
    valueStyles: { fontWeight: 600 },
  },
];
