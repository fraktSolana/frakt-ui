import { web3, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Loan, LoanType } from '@frakt/api/loans';

import { captureSentryTxnError } from '../sentry';
import { notify, logTxnError } from '../';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { MAX_ACCOUNTS_IN_FAST_TRACK, makeRepayBondTransaction } from '../bonds';
import { makePaybackLoanTransaction } from './makePaybackLoanTransaction';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

type PaybackLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loan: Loan;
  paybackAmount?: BN;
}) => Promise<boolean>;

export const paybackLoan: PaybackLoan = async ({
  connection,
  wallet,
  loan,
  paybackAmount,
}): Promise<boolean> => {
  if (
    loan.loanType === LoanType.PRICE_BASED ||
    loan.loanType === LoanType.TIME_BASED
  ) {
    try {
      const { transaction, signers } = await (async () => {
        return await makePaybackLoanTransaction({
          loan,
          paybackAmount,
          wallet,
          connection,
        });
      })();

      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
        commitment: 'confirmed',
      });

      notify({
        message: 'Paid back successfully!',
        type: NotifyType.SUCCESS,
      });

      return true;
    } catch (error) {
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
        transactionName: 'paybackLoan',
        params: { loan },
      });

      return false;
    }
  }
  const { createLookupTableTxn, extendLookupTableTxns, repayIxsAndSigners } =
    await makeRepayBondTransaction({
      loan,
      wallet,
      connection,
    });
  const ableToOptimize =
    repayIxsAndSigners.lookupTablePublicKeys
      .map((lookup) => lookup.addresses)
      .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK;
  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
    createLookupTableTxns: ableToOptimize ? [] : [createLookupTableTxn],
    extendLookupTableTxns: ableToOptimize ? [] : extendLookupTableTxns,
    v0InstructionsAndSigners: ableToOptimize ? [] : [repayIxsAndSigners],
    fastTrackInstructionsAndSigners: ableToOptimize ? [repayIxsAndSigners] : [],
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
        message: 'Repaid successfully!',
        type: NotifyType.SUCCESS,
      });
    },
    onError: (error) => {
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
        transactionName: 'paybackLoan',
      });
    },
  });
};
