import { reduce, Dictionary } from 'lodash';
import classNames from 'classnames';

import { LoanType } from '@frakt/api/loans';
import { BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import { Solana } from '@frakt/icons';
import {
  calcLtv,
  calcPriceBasedUpfrontFee,
} from '@frakt/pages/BorrowPages/helpers';
import { calcPriceBasedMaxLoanValue } from '@frakt/pages/BorrowPages/cartState';

import styles from './Sidebar.module.scss';

interface LoanDetailsField {
  label: string;
  value: JSX.Element;
  tooltipText?: string;
}

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number | null; //? Doesn't Exist for LoanType.PRICE_BASED
  };
  disabled?: boolean;
}

type GenerateLoanDetails = (props: {
  nft: BorrowNft;
  orderParamsLite?: OrderParamsLite;
  loanType: LoanType;
}) => Array<LoanDetailsField>;
export const generateLoanDetails: GenerateLoanDetails = ({
  nft,
  orderParamsLite,
  loanType,
}) => {
  const fields: Array<LoanDetailsField> = [];

  const { valuation } = nft;

  const loanValue =
    loanType === LoanType.BOND
      ? orderParamsLite.loanValue
      : calcPriceBasedMaxLoanValue({ nft }); //TODO

  fields.push({
    label: 'Loan value',
    value: (
      <>
        {(loanValue / 1e9).toFixed(3)} <Solana />
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
  if (loanType === LoanType.BOND) {
    const fee = orderParamsLite.loanFee;

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
  nfts: BorrowNft[];
  orderParamsByMint: Dictionary<OrderParamsLite>;
  loanType: LoanType;
}) => Array<LoanDetailsField>;
export const generateSummary: GenerateSummary = ({
  nfts,
  orderParamsByMint,
  loanType,
}) => {
  const fields: Array<LoanDetailsField> = [];

  const borrowValue = reduce(
    nfts,
    (borrowValue, nft) => {
      return (
        borrowValue +
        (loanType === LoanType.BOND
          ? orderParamsByMint[nft.mint].loanValue
          : calcPriceBasedMaxLoanValue({ nft }))
      );
    },
    0,
  );

  fields.push({
    label: 'Loans',
    value: <>{nfts?.length}</>,
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
      nfts,
      (fees, nft) => fees + (orderParamsByMint[nft.mint].loanFee ?? 0),
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
      nfts,
      (upfrontFee, nft) =>
        upfrontFee +
        calcPriceBasedUpfrontFee({
          loanValue: calcPriceBasedMaxLoanValue({ nft }),
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
      nfts,
      (feesPerDay, nft) => {
        const { borrowAPRPercent } = nft.classicParams.priceBased;
        const feePerDay =
          (calcPriceBasedMaxLoanValue({ nft }) * (borrowAPRPercent * 0.01)) /
          365;

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
