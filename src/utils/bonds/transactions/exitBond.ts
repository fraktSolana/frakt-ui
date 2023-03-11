import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';

import {
  makeExitBondMultiOrdersTransaction,
  makeExitBondTransaction,
} from './makeExitBondTransaction';
import { Order } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import { BondOrderParams } from '@frakt/api/nft';
import {
  signAndSendAllTransactions,
  signAndSendAllTransactionsInSequence,
} from '@frakt/pages/BorrowPages/BorrowManualPage/components/Sidebar/hooks';

type ExitBond = (props: {
  bond: Bond;
  market: Market;
  bondOrderParams: BondOrderParams[];
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
  const { unsetBondTxnAndSigners, sellingBondsTxnsAndSigners } =
    await makeExitBondMultiOrdersTransaction({
      bond,
      market,
      bondOrderParams: bondOrderParams,
      connection,
      wallet,
    });

  await signAndSendAllTransactionsInSequence({
    txnsAndSigners: [unsetBondTxnAndSigners, sellingBondsTxnsAndSigners],
    connection,
    wallet,
    // commitment = 'finalized',
    onBeforeApprove: () => {},
    onAfterSend: () => {},
    onSuccess: () => {},
    onError: () => {},
  });

  return true;
};
