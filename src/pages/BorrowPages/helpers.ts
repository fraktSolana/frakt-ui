import { web3 } from 'fbonds-core';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { BorrowNft } from '@frakt/api/nft';
import {
  BASE_POINTS,
  makeCreateBondMultiOrdersTransaction,
} from '@frakt/utils/bonds';
import { CartOrder } from '@frakt/pages/BorrowPages/cartState';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from '@frakt/utils/transactions/helpers/signAndSendV0TransactionWithLookupTablesSeparateSignatures';
import { captureSentryError } from '@frakt/utils/sentry';
import {
  InstructionsAndSigners,
  showSolscanLinkNotification,
  TxnsAndSigners,
} from '@frakt/utils/transactions';
import { LoanType } from '@frakt/api/loans';
import { notify } from '@frakt/utils';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { NotifyType } from '@frakt/utils/solanaUtils';

import { BondOrderParams } from './cartState';

type CalcLtv = (props: { nft: BorrowNft; loanValue: number }) => number;
export const calcLtv: CalcLtv = ({ nft, loanValue }) => {
  const ltv = (loanValue / nft.valuation) * 100;

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
  isSupportSignAllTxns?: boolean;
}) => Promise<boolean>;

export const borrowBulk: BorrowBulk = async ({
  orders,
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

  const bondTransactionsAndSignersChunks = await Promise.all(
    bondOrders.map((order) => {
      return makeCreateBondMultiOrdersTransaction({
        nftMint: order.borrowNft.mint,
        market: order.bondOrderParams.market,
        bondOrderParams: order.bondOrderParams.orderParams,
        connection,
        wallet,
      });
    }),
  );

  const firstChunk: TxnsAndSigners[] = [
    ...bondTransactionsAndSignersChunks
      .map((chunk) => ({
        transaction: chunk.createLookupTableTxn,
        signers: [],
      }))
      .flat(),
  ];

  const secondChunk: TxnsAndSigners[] = [
    ...bondTransactionsAndSignersChunks
      .map((chunk) =>
        chunk.extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      )
      .flat(),
  ];

  const createAndSellBondsIxsAndSignersChunk: InstructionsAndSigners[] = [
    ...bondTransactionsAndSignersChunks
      .map((chunk) => chunk.createAndSellBondsIxsAndSigners)
      .flat(),
  ];

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    notBondTxns: notBondTransactionsAndSigners.flat(),
    createLookupTableTxns: firstChunk.map((txn) => txn.transaction),
    extendLookupTableTxns: secondChunk.map((txn) => txn.transaction),
    v0InstructionsAndSigners: createAndSellBondsIxsAndSignersChunk,
    // lookupTablePublicKey: bondTransactionsAndSignersChunks,
    connection,
    wallet,
    commitment: 'confirmed',
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
