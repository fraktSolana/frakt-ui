import { reduce, Dictionary } from 'lodash';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { LoanType } from '@frakt/api/loans';
import { BondCartOrder, BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import { calcPriceBasedUpfrontFee } from '@frakt/pages/BorrowPages/helpers';
import { calcPriceBasedMaxLoanValue } from '@frakt/pages/BorrowPages/cartState';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { notify } from '@frakt/utils';
import { captureSentryError } from '@frakt/utils/sentry';
import { borrow as borrowBonds } from 'fbonds-core/lib/fbond-protocol/functions/bond/creation';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { IS_TEST_TRANSACTION } from '@frakt/config';

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

  const loanValue =
    loanType === LoanType.BOND
      ? orderParamsLite.loanValue
      : calcPriceBasedMaxLoanValue({ nft }); //TODO

  fields.push({
    label: 'Borrow',
    value: <>{(loanValue / 1e9).toFixed(3)}◎</>,
  });

  //? PriceBased liquidation price
  if (loanType === LoanType.PRICE_BASED) {
    const { collaterizationRate } = nft.classicParams.priceBased;

    const liquidationPrice =
      loanValue + loanValue * (collaterizationRate / 100);

    fields.push({
      label: 'Liquidation price',
      value: <>{(liquidationPrice / 1e9)?.toFixed(3)}◎</>,
    });
  }

  //? Bond interest
  if (loanType === LoanType.BOND) {
    const fee = orderParamsLite.loanFee;

    const feePercent = (fee / loanValue) * 100;

    fields.push({
      label: 'Fee',
      value: (
        <>
          {(fee / 1e9).toFixed(3)}◎ ({feePercent.toFixed(1)}%)
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
    label: 'Borrow',
    value: <>{(borrowValue / 1e9).toFixed(3)}◎</>,
  });

  if (loanType === LoanType.BOND) {
    const fees = reduce(
      nfts,
      (fees, nft) => fees + (orderParamsByMint[nft.mint].loanFee ?? 0),
      0,
    );

    const repayValue = borrowValue + fees;

    fields.push({
      label: 'Repay',
      value: <>{(repayValue / 1e9).toFixed(3)}◎</>,
    });

    const feesPercent = (fees / borrowValue) * 100;

    fields.push({
      label: 'Total fee',
      value: (
        <>
          {(fees / 1e9).toFixed(3)}◎ ({feesPercent.toFixed(1)}%)
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
      value: <>{(upfrontFee / 1e9).toFixed(3)}◎</>,
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
      ['Fee on 1D', 1],
      ['Fee on 7D', 7],
      ['Fee on 30D', 30],
      ['Fee on 1Y', 365],
    ].forEach(([label, daysAmount]: [string, number]) =>
      fields.push({
        label,
        value: <>{((feesPerDay * daysAmount) / 1e9).toFixed(3)}◎</>,
      }),
    );
  }

  return fields;
};

export interface LiteOrder {
  loanType: LoanType;
  loanValue: number; //? lamports. Max for timeBased, selected for priceBased and Bonds
  borrowNft: BorrowNft;
  bondOrderParams?: BondCartOrder[];
}

type Borrow = (props: {
  orders: LiteOrder[];
  isLedger?: boolean;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const borrow: Borrow = async ({
  orders,
  isLedger = false,
  connection,
  wallet,
}): Promise<boolean> => {
  const notBondOrders = orders.filter(
    (order) => order.loanType !== LoanType.BOND,
  );
  const notBondTransactionsAndSigners = await Promise.all(
    notBondOrders.map((order) => {
      return makeProposeTransaction({
        nftMint: order.borrowNft.mint,
        valuation: order.borrowNft.valuation,
        loanValue: order.loanValue,
        loanType: order.loanType,
        connection,
        wallet,
      });
    }),
  );
  const bondOrders = orders.filter((order) => order.loanType === LoanType.BOND);

  return await borrowBonds({
    isTest: IS_TEST_TRANSACTION,
    notBondTxns: [...notBondTransactionsAndSigners.flat()],
    orders: bondOrders,
    isLedger,
    skipPreflight: false,
    connection,
    wallet,
    onAfterSend: () => {
      notify({
        message: 'Transactions sent!',
        type: NotifyType.INFO,
      });
    },
    onSuccess: () => {
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
      });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.warn(error.logs?.join('\n'));

      const isNotConfirmed = showSolscanLinkNotification(error);
      if (!isNotConfirmed) {
        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      }

      captureSentryError({
        error,
        wallet,
        transactionName: 'borrowBulk',
      });
    },
  });
};
