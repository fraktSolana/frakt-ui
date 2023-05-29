import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Loan, LoanType } from '@frakt/api/loans';

import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { makeRepayBondTransaction } from '../bonds';
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
  const transactionsAndSigners = await Promise.all(
    loans.map(async (loan) => {
      if (loan.loanType === LoanType.BOND) {
        return await makeRepayBondTransaction({
          loan,
          wallet,
          connection,
        });
      } else {
        return await makePaybackLoanTransaction({
          loan,
          wallet,
          connection,
        });
      }
    }),
  );

  return signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    notBondTxns: transactionsAndSigners,
    createLookupTableTxns: [],
    extendLookupTableTxns: [],
    v0InstructionsAndSigners: [],
    fastTrackInstructionsAndSigners: [],

    isLedger,
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
