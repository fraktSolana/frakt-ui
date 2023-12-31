import { web3 } from 'fbonds-core';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { BorrowNft } from '@frakt/api/nft';
import { BASE_POINTS } from '@frakt/utils/bonds';
import { CartOrder } from '@frakt/pages/BorrowPages/cartState';
import { captureSentryTxnError } from '@frakt/utils/sentry';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { LoanType } from '@frakt/api/loans';
import { logTxnError, notify } from '@frakt/utils';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { NotifyType } from '@frakt/utils/solanaUtils';

import { BondOrderParams } from './cartState';
import { borrowCnft } from 'fbonds-core/lib/fbond-protocol/functions/bond/creation';
import { IS_TEST_TRANSACTION } from '@frakt/config';

type CalcLtv = (props: {
  nft: BorrowNft;
  loanValue: number;
  loanType?: LoanType;
}) => number;
export const calcLtv: CalcLtv = ({ nft, loanValue, loanType }) => {
  const isBond = loanType === LoanType.BOND;
  const valuation = isBond ? nft.bondParams.floorPrice : nft.valuation;

  const ltv = (loanValue / valuation) * 100;

  return ltv;
};

type CalcPriceBasedUpfrontFee = (props: { loanValue: number }) => number;
export const calcPriceBasedUpfrontFee: CalcPriceBasedUpfrontFee = ({
  loanValue,
}) => {
  return loanValue * 0.01;
};

type CalcTimeBasedFee = (props: {
  nft: BorrowNft;
  loanValue: number;
  duration?: number;
}) => number;
export const calcTimeBasedFee: CalcTimeBasedFee = ({
  nft,
  loanValue,
  duration,
}) => {
  const {
    fee: feeAllTIme,
    returnPeriodDays,
    ltvPercent,
    feeDiscountPercent,
  } = nft.classicParams.timeBased;

  const ltv = calcLtv({
    loanValue,
    nft,
  });

  const feePerDayMaxLTV = feeAllTIme / returnPeriodDays;

  const ltvDiff = ltv / ltvPercent;

  const feeAmount = feePerDayMaxLTV * ltvDiff * (duration ?? returnPeriodDays);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return feeAmountWithDiscount;
};

type CalcTimeBasedRepayValue = (props: {
  nft: BorrowNft;
  loanValue: number;
}) => number;
export const calcTimeBasedRepayValue: CalcTimeBasedRepayValue = ({
  nft,
  loanValue,
}) => {
  const fee = calcTimeBasedFee({
    nft,
    loanValue,
  });

  return loanValue + fee;
};

type CalcBondMultiOrdersFee = (bondOrderParams: BondOrderParams) => number;
export const calcBondMultiOrdersFee: CalcBondMultiOrdersFee = (
  bondOrderParams,
) => {
  const feeLamports = bondOrderParams.orderParams.reduce(
    (feeSum, orderParam) =>
      feeSum + orderParam.orderSize * (BASE_POINTS - orderParam.spotPrice),
    0,
  );
  return feeLamports;
};

type CalcDurationByMultiOrdersBond = (
  bondOrderParams: BondOrderParams,
) => number;
export const calcDurationByMultiOrdersBond: CalcDurationByMultiOrdersBond = (
  bondOrderParams,
) => {
  const duration = bondOrderParams.orderParams.reduce(
    (maxDuration, orderParam) =>
      Math.max(maxDuration, orderParam.durationFilter),
    0,
  );
  return duration;
};

type BorrowBulk = (props: {
  orders: CartOrder[];
  connection: web3.Connection;
  wallet: WalletContextState;
  isLedger?: boolean;
}) => Promise<boolean>;

export const borrowBulk: BorrowBulk = async ({
  orders,
  connection,
  wallet,
  isLedger = false,
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

  const bondOrders = orders
    .filter((order) => order.loanType === LoanType.BOND)
    .map((order) => ({
      borrowNft: order.borrowNft,
      bondOrderParams: order.bondOrderParams.orderParams.filter(
        (orderParam) => orderParam.orderSize > 0,
      ),
      cnftParams: order.borrowNft.cnftParams,
    }));

  return borrowCnft({
    isTest: IS_TEST_TRANSACTION,
    notBondTxns: notBondTransactionsAndSigners.flat(),
    orders: bondOrders,
    isLedger,
    skipPreflight: false,
    maxAccountsInCnft: 36,
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
    onError: (error: any) => {
      logTxnError(error);

      const isNotConfirmed = showSolscanLinkNotification(error);
      if (!isNotConfirmed) {
        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      }

      captureSentryTxnError({
        error,
        walletPubkey: wallet?.publicKey?.toBase58(),
        transactionName: 'borrowBulk',
        params: {
          orders,
          isLedger,
        },
      });
    },
  });
};
