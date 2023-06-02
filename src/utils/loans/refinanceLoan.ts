import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { MAX_ACCOUNTS_IN_FAST_TRACK } from '@frakt/utils/bonds';
import { BondCartOrder } from '@frakt/api/nft';
import { Market } from '@frakt/api/bonds';
import { Loan } from '@frakt/api/loans';

import { makeRefinanceLoanTransaction } from './makeRefinanceLoanTransaction';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify, throwLogsError } from '../';
import {
  showSolscanLinkNotification,
  signAndSendV0TransactionWithLookupTables,
} from '../transactions';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

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
  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
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
      throwLogsError(error);

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
