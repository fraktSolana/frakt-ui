import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Loan, LoanType } from '@frakt/api/loans';

import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { MAX_ACCOUNTS_IN_FAST_TRACK, makeRepayBondTransaction } from '../bonds';
import { makePaybackLoanTransaction } from './makePaybackLoanTransaction';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

type PaybackLoans = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loans: Loan[];
  isLedger?: boolean;
}) => Promise<boolean>;

export const paybackLoans: PaybackLoans = async ({
  connection,
  wallet,
  loans,
  isLedger = false,
}): Promise<boolean> => {
  const notBondtransactionsAndSigners = await Promise.all(
    loans
      .filter((loan) => loan.loanType !== LoanType.BOND)
      .map(
        async (loan) =>
          await makePaybackLoanTransaction({
            loan,
            wallet,
            connection,
          }),
      ),
  );

  const fastTrackBondTxns = (
    await Promise.all(
      loans
        .filter((loan) => loan.loanType === LoanType.BOND)
        .map(async (loan) => {
          const {
            createLookupTableTxn,
            extendLookupTableTxns,
            repayIxsAndSigners,
          } = await makeRepayBondTransaction({
            loan,
            wallet,
            connection,
          });
          const ableToOptimize =
            repayIxsAndSigners.lookupTablePublicKeys
              .map((lookup) => lookup.addresses)
              .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK;
          return ableToOptimize ? repayIxsAndSigners : null;
        }),
    )
  ).filter((ix) => ix);

  const bigBondTxns = (
    await Promise.all(
      loans
        .filter((loan) => loan.loanType === LoanType.BOND)
        .map(async (loan) => {
          const {
            createLookupTableTxn,
            extendLookupTableTxns,
            repayIxsAndSigners,
          } = await makeRepayBondTransaction({
            loan,
            wallet,
            connection,
          });
          const ableToOptimize =
            repayIxsAndSigners.lookupTablePublicKeys
              .map((lookup) => lookup.addresses)
              .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK;
          return !ableToOptimize
            ? {
                createLookupTableTxn,
                extendLookupTableTxns,
                repayIxsAndSigners,
              }
            : null;
        }),
    )
  ).filter((ix) => ix);

  return signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    notBondTxns: notBondtransactionsAndSigners,
    createLookupTableTxns: bigBondTxns.map(
      (bigTx) => bigTx.createLookupTableTxn,
    ),
    extendLookupTableTxns: bigBondTxns
      .map((bigTx) => bigTx.extendLookupTableTxns)
      .flat(),
    v0InstructionsAndSigners: bigBondTxns.map(
      (bigTx) => bigTx.repayIxsAndSigners,
    ),
    fastTrackInstructionsAndSigners: [...fastTrackBondTxns],

    isLedger,
    skipTimeout: true,

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
        message: 'Paid back successfully!',
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
        transactionName: 'paybackLoans',
      });
    },
  });
};
