import {
  refinanceFbondByLender as txn,
  RepayAccounts,
} from 'fbonds-core/lib/fbond-protocol/functions/bond/repayment';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { logTxnError, notify, sendTxnPlaceHolder } from '../index';
import { captureSentryTxnError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { showSolscanLinkNotification } from '../transactions';
import { InstructionsAndSigners } from 'fbonds-core/lib/fbond-protocol/types';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

type RefinanceBondByLender = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  fbondPubkey: string;
  hadoMarketPubkey: string;
  repayAccounts: RepayAccounts[];
}) => Promise<boolean>;

export const refinanceBondByLender: RefinanceBondByLender = async ({
  connection,
  wallet,
  fbondPubkey,
  repayAccounts,
  hadoMarketPubkey,
}): Promise<boolean> => {
  const { instructions, signers } = await txn({
    programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
    connection,
    args: {
      nextBoxIndex: '0',
      repayAccounts,
    },
    addComputeUnits: true,
    accounts: {
      userPubkey: wallet.publicKey,
      fbond: new web3.PublicKey(fbondPubkey),
      adminPubkey: new web3.PublicKey(process.env.BONDS_ADMIN_PUBKEY),
      hadoMarket: new web3.PublicKey(hadoMarketPubkey),
      protocolFeeReceiver: new web3.PublicKey(process.env.BONDS_ADMIN_PUBKEY),
    },
    sendTxn: sendTxnPlaceHolder,
  });

  const intstructionsAndSigners: InstructionsAndSigners = {
    instructions,
    signers,
    lookupTablePublicKeys: [],
  };
  return signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    notBondTxns: [],
    createLookupTableTxns: [],
    extendLookupTableTxns: [],
    v0InstructionsAndSigners: [],
    fastTrackInstructionsAndSigners: [intstructionsAndSigners],

    isLedger: false,
    skipTimeout: true,
    // lookupTablePublicKey: bondTransactionsAndSignersChunks,
    // skipPreflight: true,
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
        transactionName: 'refinanceFbondByLender',
      });
    },
  });
};
