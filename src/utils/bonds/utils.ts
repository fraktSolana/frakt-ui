import { maxBy } from 'lodash';
import {
  BondFeatures,
  FraktBondState,
} from 'fbonds-core/lib/fbond-protocol/types';

import { Bond, Pair } from '@frakt/api/bonds';
import { BondCartOrder } from '@frakt/api/nft';
import { groupBy } from 'ramda';

export const calcRisk = (value: number) => {
  if (value < 40) {
    return 'low';
  }
  if (40 <= value && value <= 70) {
    return 'medium';
  }
  if (value > 70 && value <= 100) {
    return 'high';
  }
};

interface ColorBreakpoints {
  [key: number]: string;
}

export const colorByPercentOffers: ColorBreakpoints = {
  11: '#7DCC19',
  22: '#9ECC19',
  33: '#B3CC19',
  44: '#C9CC19',
  55: '#CCBA19',
  66: '#CCA519',
  77: '#CC8419',
  89: '#CC5A19',
  100: '#CC1939',
};

export const colorByPercentHealth: ColorBreakpoints = {
  0: '#CC1939',
  22: '#CC5A19',
  33: '#CC8419',
  44: '#CCA519',
  55: '#CCBA19',
  66: '#C9CC19',
  77: '#B3CC19',
  89: '#9ECC19',
  100: '#7DCC19',
};

export const colorByPercentSlider: ColorBreakpoints = {
  11: '#9CFF1F',
  22: '#C5FF1F',
  33: '#E0FF1F',
  44: '#FBFF1F',
  55: '#FFE91F',
  66: '#FFCE1F',
  77: '#FFA51F',
  89: '#FF701F',
  100: '#FF1F47',
};

export const getColorByPercent = (
  value: number,
  colorBreakpoints: ColorBreakpoints,
): string => {
  const limit = Object.keys(colorBreakpoints).find(
    (limit) => value <= parseInt(limit),
  );
  return colorBreakpoints[limit] || colorBreakpoints[10];
};

export const calcBondRedeemLamports = (bond: Bond) => {
  const { fbond, stats } = bond;
  return (
    stats.amountOfUserBonds *
    (fbond.actualReturnedAmount / fbond.fbondTokenSupply)
  );
};

export const isBondAvailableToRedeem = (bond: Bond) => {
  const { fbond } = bond;

  return (
    fbond.fraktBondState === FraktBondState.Repaid ||
    fbond.fraktBondState === FraktBondState.Liquidated
  );
};

type PairLoanDurationFilter = (props: {
  pair: Pair;
  duration?: number;
}) => boolean;
export const pairLoanDurationFilter: PairLoanDurationFilter = ({
  pair,
  duration = 7, //? Days
  // }) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter; //TODO: Allow to take loans with shorter duration
}) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter;

type PairLtvFilter = (props: { pair: Pair; ltvBasePoints: number }) => boolean;
export const pairLtvFilter: PairLtvFilter = ({
  pair,
  ltvBasePoints = 1000, //? 1000 === 10%
}) => ltvBasePoints <= pair?.validation?.loanToValueFilter;

type MergeBondOrderParamsByPair = (props: {
  bondOrderParams: BondCartOrder[];
}) => BondCartOrder[];
export const mergeBondOrderParamsByPair: MergeBondOrderParamsByPair = ({
  bondOrderParams,
}) => {
  const groupedPairOrderParams = Object.values(
    groupBy((orderParam) => orderParam.pairPubkey, bondOrderParams),
  );

  const mergedPairsOrderParams = groupedPairOrderParams.map((orderParams) =>
    orderParams.reduce((acc, orderParam) => ({
      ...acc,
      orderSize: acc.orderSize + orderParam.orderSize,
      spotPrice:
        (acc.orderSize * acc.spotPrice +
          orderParam.orderSize * orderParam.spotPrice) /
        (acc.orderSize + orderParam.orderSize),
    })),
  );

  return mergedPairsOrderParams;
};

export const isBondFeaturesAutomated = (bondFeature: BondFeatures) =>
  bondFeature === BondFeatures.Autocompound ||
  bondFeature === BondFeatures.AutoreceiveSol ||
  bondFeature === BondFeatures.AutoCompoundAndReceiveNft ||
  bondFeature === BondFeatures.AutoReceiveAndReceiveNft
    ? true
    : false;

export const isAutocompoundBondFeature = (bondFeature: BondFeatures) =>
  bondFeature === BondFeatures.Autocompound ||
  bondFeature === BondFeatures.AutoCompoundAndReceiveNft
    ? true
    : false;

export const isLiquidatedBondFeature = (bondFeature: BondFeatures) =>
  bondFeature === BondFeatures.None ||
  bondFeature === BondFeatures.Autocompound ||
  bondFeature === BondFeatures.AutoreceiveSol;
