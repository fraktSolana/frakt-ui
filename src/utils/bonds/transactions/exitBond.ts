import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Bond, Market } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import {
  showSolscanLinkNotification,
  signAndSendAllTransactionsInSequence,
  signAndSendV0TransactionWithLookupTables,
} from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';
import { BondCartOrder } from '@frakt/api/nft';

import { makeExitBondMultiOrdersTransactionV2 } from './makeExitBondTransaction';

type ExitBond = (props: {
  bond: Bond;
  market: Market;
  bondOrderParams: BondCartOrder[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const exitBond: ExitBond = async ({
  bond,
  market,
  bondOrderParams,
  connection,
  wallet,
}): Promise<boolean> => {
  const {
    createLookupTableTxn,
    extendLookupTableTxns,
    exitAndSellBondsIxsAndSigners,
  } = await makeExitBondMultiOrdersTransactionV2({
    bond,
    market,
    bondOrderParams: bondOrderParams,
    connection,
    wallet,
  });

  await signAndSendV0TransactionWithLookupTables({
    createLookupTableTxns: [createLookupTableTxn],
    extendLookupTableTxns: extendLookupTableTxns,
    v0InstructionsAndSigners: [exitAndSellBondsIxsAndSigners],
    fastTrackInstructionsAndSigners: [],
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
        message: 'Exited successfully!',
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

  return true;
};
