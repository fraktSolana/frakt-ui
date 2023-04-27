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
  try {
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
    // const {
    //   refinanceBondTxnAndSigners,
    //   createAndExtendLutTxnAndSigners,
    //   lookupTablePubkey,
    // } = await makeRefinanceLoanAndCreateLutTransactions({
    //   wallet,
    //   connection,
    //   loan,
    //   pair,
    //   market,
    // });
    // const bondLookupTable = new web3.PublicKey(loan.bondParams?.lookupTable)
    // await signAndConfirmTxnWithLookupTables({
    //   transaction,
    //   lookupTables,
    //   signers,
    //   connection,
    //   wallet,
    //   commitment: 'confirmed',
    // });
    return signAndSendV0TransactionWithLookupTables({
      createLookupTableTxns: [createLookupTableTxn],
      extendLookupTableTxns: extendLookupTableTxns,
      v0InstructionsAndSigners: [refinanceIxsAndSigners],
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
          message: 'Refinanced successfully!',
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
          transactionName: 'refinanceLoan',
        });
      },
    });
  } catch (error) {
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
      transactionName: 'refinanceLoan',
      params: { loan },
    });

    return false;
  }
};
