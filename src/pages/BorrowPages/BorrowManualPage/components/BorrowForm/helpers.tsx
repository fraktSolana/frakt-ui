import { uniq, maxBy } from 'lodash';
import classNames from 'classnames';
import { getMaxBorrowValueOptimized } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';

import { Market, Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/loans';
import { BOND_DECIMAL_DELTA, pairLoanDurationFilter } from '@frakt/utils/bonds';
import { BorrowNft } from '@frakt/api/nft';
import { Solana } from '@frakt/icons';
import {
  calcBondMultiOrdersFee,
  calcLtv,
  calcPriceBasedUpfrontFee,
  calcTimeBasedFee,
  calcTimeBasedRepayValue,
} from '@frakt/pages/BorrowPages/helpers';
import { BondOrderParams } from '@frakt/pages/BorrowPages/cartState';

import { LoanDetailsField } from './types';
import styles from './BorrowForm.module.scss';

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number | null; //? Doesn't Exist for LoanType.PRICE_BASED
  };
  disabled?: boolean;
}

type GetBorrowValueRange = (props: {
  nft: BorrowNft;
  loanType: LoanType;
  bondsParams?: {
    pairs: Pair[];
    market: Market;
    duration: number; //? Days
  };
}) => [number, number];
export const getBorrowValueRange: GetBorrowValueRange = ({
  nft,
  loanType,
  bondsParams,
}) => {
  const { valuation, classicParams } = nft;

  const maxBorrowValueTimeBased =
    valuation * (classicParams?.timeBased?.ltvPercent / 100);
  const maxBorrowValuePriceBased =
    valuation * (classicParams?.priceBased?.ltvPercent / 100);
  const minBorrowValue = valuation / 100;

  const maxBorrowValue = (() => {
    if (loanType === LoanType.PRICE_BASED) return maxBorrowValuePriceBased;
    if (loanType === LoanType.TIME_BASED) return maxBorrowValueTimeBased;

    const maxBorrowValue = getMaxBorrowValueOptimized({
      bondOffers: bondsParams?.pairs.filter((p) =>
        pairLoanDurationFilter({ pair: p, duration: bondsParams.duration }),
      ),
      collectionFloor: bondsParams?.market?.oracleFloor?.floor,
    });

    //? LoanType.BONDS
    return maxBorrowValue;
  })();

  return [Math.min(minBorrowValue, maxBorrowValue), maxBorrowValue];
};

type GenerateSelectOptions = (props: {
  nft: BorrowNft;
  bondsParams?: {
    pairs: Pair[];
  };
}) => SelectValue[];
export const generateSelectOptions: GenerateSelectOptions = ({
  nft,
  bondsParams,
}) => {
  let options: SelectValue[] = [];

  const timeBasedDiscountAvailable =
    !!nft?.classicParams?.timeBased?.feeDiscountPercent;

  const bondsAvailable = !!nft?.bondParams?.marketPubkey;
  const nftHasLimit = nft?.classicParams?.isLimitExceeded;

  const bondOptions = bondsParams?.pairs
    ? uniq(
        bondsParams?.pairs.map(
          (pair) => pair?.validation?.durationFilter / (24 * 60 * 60),
        ),
      )
        .sort((a, b) => a - b)
        .map((period) => ({
          label: `${period} days`,
          value: {
            type: LoanType.BOND,
            duration: period,
          },
        }))
    : [];
  // if (bondsParams?.pairs) {
  //   const availablePeriods = uniq(
  //     bondsParams?.pairs.map(
  //       (pair) => pair?.validation?.durationFilter / (24 * 60 * 60),
  //     ),
  //   ).sort((a, b) => a - b);

  //   availablePeriods.forEach((period) => {
  //     options.push({
  //       label: `${period} days`,
  //       value: {
  //         type: LoanType.BOND,
  //         duration: period,
  //       },
  //     });
  //   });
  // }
  const timeBasedOptions =
    !bondsAvailable || timeBasedDiscountAvailable
      ? [
          {
            label: `${
              nft?.classicParams?.timeBased.returnPeriodDays
            } days (flip) ${nftHasLimit ? '- limit exceeded' : ''}`,
            value: {
              type: LoanType.TIME_BASED,
              duration: nft?.classicParams?.timeBased.returnPeriodDays,
            },
            disabled: nftHasLimit,
          },
        ]
      : [];
  // if (!bondsAvailable || timeBasedDiscountAvailable) {
  //   timeBasedOption =
  //     options.push({
  //       label: `${nft?.classicParams?.timeBased.returnPeriodDays} days (flip) ${nftHasLimit ? '- limit exceeded' : ''
  //         }`,
  //       value: {
  //         type: LoanType.TIME_BASED,
  //         duration: nft?.classicParams?.timeBased.returnPeriodDays,
  //       },
  //       disabled: nftHasLimit,
  //     });
  // }

  if (nft.maxLoanValue > nft.classicParams.maxLoanValue)
    options = [...options, ...bondOptions, ...timeBasedOptions];
  else options = [...options, ...timeBasedOptions, ...bondOptions];

  if (nft?.classicParams?.priceBased) {
    options = [
      ...options,
      {
        label: `Perpetual ${nftHasLimit ? '- limit exceeded' : ''}`,
        value: {
          type: LoanType.PRICE_BASED,
          duration: null,
        },
        disabled: nftHasLimit,
      },
    ];
  }
  return options;
};

type GetCheapestPairForBorrowValue = (params: {
  borrowValue: number;
  valuation: number;
  pairs: Pair[];
  duration: number;
}) => Pair;
export const getCheapestPairForBorrowValue: GetCheapestPairForBorrowValue = ({
  borrowValue,
  valuation,
  pairs,
  duration,
}) => {
  const suitablePairsByDuration = pairs.filter((p) =>
    pairLoanDurationFilter({ pair: p, duration }),
  );

  const suitableBySettlementAndValidation = suitablePairsByDuration.filter(
    (pair) => {
      const borrowValueBonds = borrowValue / pair.currentSpotPrice;
      const loanToValueLamports =
        valuation * (pair.validation.loanToValueFilter * 0.01 * 0.01);

      return (
        // borrowValueBonds <= pair.edgeSettlement &&
        loanToValueLamports >= borrowValueBonds * BOND_DECIMAL_DELTA
      );
    },
  );

  return maxBy(
    suitableBySettlementAndValidation,
    (pair) => pair.currentSpotPrice,
  );
};

type GenerateLoanDetails = (props: {
  nft: BorrowNft;
  loanType: LoanType;
  loanValue: number;
  bondOrderParams?: BondOrderParams;
}) => Array<LoanDetailsField>;
export const generateLoanDetails: GenerateLoanDetails = ({
  nft,
  loanType,
  loanValue,
  bondOrderParams,
}) => {
  const fields: Array<LoanDetailsField> = [];

  const { valuation } = nft;
  fields.push({
    label: 'Floor price',
    value: (
      <>
        {(valuation / 1e9).toFixed(2)} <Solana />
      </>
    ),
  });

  const ltv = calcLtv({
    loanValue,
    nft,
  });

  fields.push({
    label: 'LTV',
    value: <>{ltv.toFixed(0)}%</>,
  });

  //? PriceBased liquidation price
  if (loanType === LoanType.PRICE_BASED) {
    const { collaterizationRate, ltvPercent } = nft.classicParams.priceBased;

    const liquidationPrice =
      loanValue + loanValue * (collaterizationRate / 100);

    const liquidationDrop = ((valuation - liquidationPrice) / valuation) * 100;

    const MIN_LTV = 10;

    const riskPercent = (ltv - MIN_LTV) / (ltvPercent - MIN_LTV);

    fields.push({
      label: 'Liquidation price',
      tooltipText:
        'How much the NFT price needs to drop for your loan to get liquidated',
      value: (
        <span
          className={classNames(styles.redText, {
            [styles.yellowText]: riskPercent < 0.875,
            [styles.greenText]: riskPercent <= 0.5,
          })}
        >
          {(liquidationPrice / 1e9)?.toFixed(3)} SOL (-
          {liquidationDrop?.toFixed()}%)
        </span>
      ),
    });
  }

  //? TimeBased fees (1d, 7d, 14d)
  if (loanType === LoanType.TIME_BASED) {
    const { returnPeriodDays } = nft.classicParams.timeBased;

    const feeOn1d = calcTimeBasedFee({
      nft,
      loanValue,
      duration: 1,
    });

    fields.push({
      label: 'Fee on 1d',
      value: (
        <>
          {(feeOn1d / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });

    fields.push({
      label: 'Fee on 7d',
      value: (
        <>
          {((feeOn1d * 7) / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });

    returnPeriodDays === 14 &&
      fields.push({
        label: 'Fee on 14d',
        value: (
          <>
            {((feeOn1d * 14) / 1e9).toFixed(3)} <Solana />
          </>
        ),
      });
  }

  //? PriceBased fees (1d, 7d, 30d, 1y)
  if (loanType === LoanType.PRICE_BASED) {
    const { borrowAPRPercent } = nft.classicParams.priceBased;

    const feePerDay = (loanValue * (borrowAPRPercent * 0.01)) / 365;

    fields.push({
      label: 'Fee on 1d',
      value: (
        <>
          {(feePerDay / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
    fields.push({
      label: 'Fee on 7d',
      value: (
        <>
          {((feePerDay * 7) / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
    fields.push({
      label: 'Fee on 30d',
      value: (
        <>
          {((feePerDay * 30) / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
    fields.push({
      label: 'Fee on 1y',
      tooltipText: 'The current yearly interest rate paid by borrowers',
      value: (
        <>
          {((feePerDay * 365) / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
  }

  //? Bond fee and repay value
  if (loanType === LoanType.BOND && bondOrderParams) {
    const fee = calcBondMultiOrdersFee(bondOrderParams);

    fields.push({
      label: 'Fee',
      value: (
        <>
          {(fee / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });

    const repayValue = loanValue + fee;
    fields.push({
      label: 'Repay value',
      value: (
        <>
          {(repayValue / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
  }

  //? TimeBased holder discount
  if (loanType === LoanType.TIME_BASED) {
    const feeDiscountPercent = nft.classicParams.timeBased.feeDiscountPercent;
    feeDiscountPercent &&
      fields.push({
        label: 'Holder discount',
        value: <>{feeDiscountPercent.toFixed(0)}%</>,
      });
  }

  //? TimeBased repay value
  if (loanType === LoanType.TIME_BASED) {
    const repayValue = calcTimeBasedRepayValue({
      nft,
      loanValue,
    });
    fields.push({
      label: 'Repay value',
      value: (
        <>
          {(repayValue / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
  }

  //? PriceBased upfront fee
  if (loanType === LoanType.PRICE_BASED) {
    const upfrontFee = calcPriceBasedUpfrontFee({
      loanValue,
    });
    fields.push({
      label: 'Upfront fee',
      value: (
        <>
          {(upfrontFee / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
  }

  return fields;
};
