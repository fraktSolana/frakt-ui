import { web3, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Market, Pair } from '@frakt/api/bonds';
import { Loan } from '@frakt/api/loans';

import { makeRefinanceLoanTransaction } from './makeRefinanceLoanTransaction';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import {
  showSolscanLinkNotification,
  signAndSendV0TransactionWithLookupTables,
} from '../transactions';
import { BondCartOrder } from '@frakt/api/nft';
import { MAX_ACCOUNTS_IN_FAST_TRACK } from '@frakt/utils/bonds';
// import { makeRefinanceLoanAndCreateLutTransactions } from './makeRefinanceLoanAndCreateLutTransactions';
// import { createAndSendAllTxns } from '../transactions/helpers/v0/createAndSendV0Transaction';

type RefinanceLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  bondOrderParams: BondCartOrder[];
  loan: Loan;
  market: Market;
}) => Promise<boolean>;

export const refinanceLoan: RefinanceLoan = async ({
  connection,
  wallet,
  loan,
  market,
  bondOrderParams,
}): Promise<boolean> => {
  const {
    createLookupTableTxn,
    extendLookupTableTxns,
    refinanceIxsAndSigners,
  } = await makeRefinanceLoanTransaction({
    wallet,
    connection,
    bondOrderParams,
    loan,
    market,
  });
  const ableToOptimize =
    refinanceIxsAndSigners.lookupTablePublicKeys
      .map((lookup) => lookup.addresses)
      .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK;

  return await signAndSendV0TransactionWithLookupTables({
    createLookupTableTxns: ableToOptimize ? [] : [createLookupTableTxn],
    extendLookupTableTxns: ableToOptimize ? [] : extendLookupTableTxns,
    v0InstructionsAndSigners: ableToOptimize ? [] : [refinanceIxsAndSigners],
    fastTrackInstructionsAndSigners: ableToOptimize
      ? [refinanceIxsAndSigners]
      : [],
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
        transactionName: 'borrowSingleBond',
      });
    },
  });
};
