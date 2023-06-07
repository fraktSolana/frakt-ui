import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Bond, Market } from '@frakt/api/bonds';
import { notify, throwLogsError } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import {
  showSolscanLinkNotification,
  signAndSendAllTransactionsInSequence,
  signAndSendV0TransactionWithLookupTables,
} from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';
import { BondCartOrder } from '@frakt/api/nft';

import { makeExitBondMultiOrdersTransactionV2 } from './makeExitBondTransaction';
import { MAX_ACCOUNTS_IN_FAST_TRACK } from '../constants';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

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

  const ableToOptimize =
    exitAndSellBondsIxsAndSigners.lookupTablePublicKeys
      .map((lookup) => lookup.addresses)
      .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK;
  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
    createLookupTableTxns: ableToOptimize ? [] : [createLookupTableTxn],
    extendLookupTableTxns: ableToOptimize ? [] : extendLookupTableTxns,
    v0InstructionsAndSigners: ableToOptimize
      ? []
      : [exitAndSellBondsIxsAndSigners],
    fastTrackInstructionsAndSigners: ableToOptimize
      ? [exitAndSellBondsIxsAndSigners]
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
        message: 'Exited successfully!',
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
        transactionName: 'exitLoan',
      });
    },
  });
};
