import { uniq, maxBy, reduce } from 'lodash';
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
  // calcPriceBasedUpfrontFee,
  // calcTimeBasedFee,
  // calcTimeBasedRepayValue,
} from '@frakt/pages/BorrowPages/helpers';
import { BondOrderParams, CartOrder } from '@frakt/pages/BorrowPages/cartState';

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

  options = [...options, ...bondOptions];

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

  fields.push({
    label: 'Loan value',
    value: (
      <>
        {(loanValue / 1e9).toFixed(3)} <Solana />
      </>
    ),
  });

  const { valuation } = nft;

  const ltv = calcLtv({
    loanValue,
    nft,
  });

  fields.push({
    label: 'LTV',
    value: <>{ltv.toFixed(0)}%</>,
  });

  //? PriceBased yearly interest
  if (loanType === LoanType.PRICE_BASED) {
    const { borrowAPRPercent } = nft.classicParams.priceBased;

    fields.push({
      label: 'Yearly interest',
      value: <>{borrowAPRPercent.toFixed(2)}%</>,
    });
  }

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

  //? Bond interest
  if (loanType === LoanType.BOND && bondOrderParams) {
    const fee = calcBondMultiOrdersFee(bondOrderParams);

    fields.push({
      label: 'Interest',
      value: (
        <>
          {(fee / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
  }

  return fields;
};

type GenerateSummary = (props: {
  orders: CartOrder[];
  loanType: LoanType;
}) => Array<LoanDetailsField>;
export const generateSummary: GenerateSummary = ({ orders, loanType }) => {
  const fields: Array<LoanDetailsField> = [];

  const borrowValue = reduce(
    orders,
    (borrowValue, order) => order?.loanValue + borrowValue,
    0,
  );

  fields.push({
    label: 'Loans',
    value: <>{orders?.length}</>,
  });

  fields.push({
    label: 'Borrowing',
    value: (
      <>
        {(borrowValue / 1e9).toFixed(3)} <Solana />
      </>
    ),
  });

  if (loanType === LoanType.BOND) {
    const fees = reduce(
      orders,
      (fees, order) =>
        fees +
        (order?.bondOrderParams
          ? calcBondMultiOrdersFee(order?.bondOrderParams)
          : 0),
      0,
    );

    const repayValue = borrowValue + fees;

    fields.push({
      label: 'To repay',
      value: (
        <>
          {(repayValue / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });

    fields.push({
      label: 'Total interest',
      value: (
        <>
          {(fees / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });
  }

  if (loanType === LoanType.PRICE_BASED) {
    const upfrontFee = reduce(
      orders,
      (upfrontFee, order) =>
        upfrontFee +
        calcPriceBasedUpfrontFee({
          loanValue: order?.loanValue,
        }),
      0,
    );

    fields.push({
      label: 'Upfront fee',
      value: (
        <>
          {(upfrontFee / 1e9).toFixed(3)} <Solana />
        </>
      ),
    });

    const feesPerDay = reduce(
      orders,
      (feesPerDay, order) => {
        const { borrowAPRPercent } = order.borrowNft.classicParams.priceBased;
        const feePerDay = (order?.loanValue * (borrowAPRPercent * 0.01)) / 365;

        return feesPerDay + feePerDay;
      },
      0,
    );

    [
      ['Interest on 1D', 1],
      ['Interest on 7D', 7],
      ['Interest on 30D', 30],
      ['Interest on 1Y', 365],
    ].forEach(([label, daysAmount]: [string, number]) =>
      fields.push({
        label,
        value: (
          <>
            {((feesPerDay * daysAmount) / 1e9).toFixed(3)} <Solana />
          </>
        ),
      }),
    );
  }

  return fields;
};
