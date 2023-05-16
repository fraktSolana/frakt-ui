import { reduce, Dictionary } from 'lodash';
import classNames from 'classnames';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { LoanType } from '@frakt/api/loans';
import { BondCartOrder, BorrowNft, OrderParamsLite } from '@frakt/api/nft';
import { Solana } from '@frakt/icons';
import {
  calcLtv,
  calcPriceBasedUpfrontFee,
} from '@frakt/pages/BorrowPages/helpers';
import { calcPriceBasedMaxLoanValue } from '@frakt/pages/BorrowPages/cartState';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { notify } from '@frakt/utils';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from '@frakt/utils/transactions/helpers/signAndSendV0TransactionWithLookupTablesSeparateSignatures';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeCreateBondMultiOrdersTransaction } from '@frakt/utils/bonds';
import { NotifyType } from '@frakt/utils/solanaUtils';
import {
  InstructionsAndSigners,
  showSolscanLinkNotification,
  TxnsAndSigners,
} from '@frakt/utils/transactions';

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

export interface LiteOrder {
  loanType: LoanType;
  loanValue: number; //? lamports. Max for timeBased, selected for priceBased and Bonds
  borrowNft: BorrowNft;
  bondOrderParams?: BondCartOrder[];
}

type Borrow = (props: {
  orders: LiteOrder[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const borrow: Borrow = async ({
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
        marketPubkey: order.borrowNft.bondParams.marketPubkey,
        fraktMarketPubkey:
          order.borrowNft.bondParams.whitelistEntry.fraktMarket,
        oracleFloorPubkey: order.borrowNft.bondParams.oracleFloor,
        whitelistEntryPubkey:
          order.borrowNft.bondParams.whitelistEntry?.publicKey,
        nftMint: order.borrowNft.mint,
        bondOrderParams: order.bondOrderParams,
        connection,
        wallet,
      });
    }),
  );

  const maxAccountsInFastTrack = 33;
  console.log(
    'lengths: ',
    bondTransactionsAndSignersChunks.map((txnAndSigners) =>
      txnAndSigners.createAndSellBondsIxsAndSigners.lookupTablePublicKeys
        .map((lookup) => lookup.addresses)
        .flat()
        .map((key) => key.toBase58()),
    ),
  );
  const fastTrackBorrows: InstructionsAndSigners[] =
    bondTransactionsAndSignersChunks
      .filter(
        (txnAndSigners) =>
          txnAndSigners.createAndSellBondsIxsAndSigners.lookupTablePublicKeys
            .map((lookup) => lookup.addresses)
            .flat().length <= maxAccountsInFastTrack,
      )
      .map((txnAndSigners) => txnAndSigners.createAndSellBondsIxsAndSigners);
  const lookupTableBorrows = bondTransactionsAndSignersChunks.filter(
    (txnAndSigners) =>
      txnAndSigners.createAndSellBondsIxsAndSigners.lookupTablePublicKeys
        .map((lookup) => lookup.addresses)
        .flat().length > maxAccountsInFastTrack,
  );

  const firstChunk: TxnsAndSigners[] = [
    ...lookupTableBorrows
      .map((chunk) => ({
        transaction: chunk.createLookupTableTxn,
        signers: [],
      }))
      .flat(),
  ];

  const secondChunk: TxnsAndSigners[] = [
    ...lookupTableBorrows
      .map((chunk) =>
        chunk.extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      )
      .flat(),
  ];

  const createAndSellBondsIxsAndSignersChunk: InstructionsAndSigners[] = [
    ...lookupTableBorrows
      .map((chunk) => chunk.createAndSellBondsIxsAndSigners)
      .flat(),
  ];

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    notBondTxns: [...notBondTransactionsAndSigners.flat()],
    createLookupTableTxns: firstChunk.map((txn) => txn.transaction),
    extendLookupTableTxns: secondChunk.map((txn) => txn.transaction),
    v0InstructionsAndSigners: createAndSellBondsIxsAndSignersChunk,
    fastTrackInstructionsAndSigners: fastTrackBorrows,
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
