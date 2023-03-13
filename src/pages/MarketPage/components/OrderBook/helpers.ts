import { Pair } from '@frakt/api/bonds';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { getTopOrderSize } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';

import { MarketOrder } from './types';

//? edgeSettlement -- amount of tokens in last order (raw value)
//? currentSpotPrice -- price for smallest part of token (BOND_SOL_DECIMAIL_DELTA)
//? validation.loanToValueFilter -- LTV
export const parseMarketOrder = (pair: Pair): MarketOrder => {
  return {
    ltv: (pair?.validation?.loanToValueFilter || 0) / 100,
    size:
      (pair ? getTopOrderSize(pair) * pair?.currentSpotPrice : 0) / 1e9 || 0,
    interest: calcInterest({
      spotPrice: pair?.currentSpotPrice,
    }),
    duration: pair?.validation?.durationFilter / 24 / 60 / 60,
    rawData: {
      publicKey: pair?.publicKey || '',
      assetReceiver: pair?.assetReceiver || '',
      edgeSettlement: pair ? getTopOrderSize(pair) : 0,
      authorityAdapter: pair?.authorityAdapterPublicKey || '',
    },
  };
};

type CalcInterest = (props: { spotPrice: number }) => number;
const calcInterest: CalcInterest = ({ spotPrice }) => {
  return 1 - spotPrice / BOND_DECIMAL_DELTA;
};

type CalcApr = (props: { spotPrice: number; durationDays: number }) => number;
export const calcApr: CalcApr = ({ spotPrice, durationDays }) => {
  const interest = 1 - spotPrice / BOND_DECIMAL_DELTA;

  const apr = (interest / durationDays) * 365;

  return apr || 0;
};

type CalcSpotPrice = (props: {
  solFeeLamports: number;
  solDepositLamports: number;
}) => number;
export const calcSpotPrice: CalcSpotPrice = ({
  solFeeLamports,
  solDepositLamports,
}) => {
  return (1 - solFeeLamports / solDepositLamports) * BOND_DECIMAL_DELTA;
};
