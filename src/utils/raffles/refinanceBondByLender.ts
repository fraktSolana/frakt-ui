import { refinanceFbondByLender as txn } from 'fbonds-core/lib/fbond-protocol/functions/bond/repayment';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { notify, sendTxnPlaceHolder } from '../index';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import {
  BondFeatures,
  InstructionsAndSigners,
} from 'fbonds-core/lib/fbond-protocol/types';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';
import { RepayAccounts } from 'fbonds-core/lib/fbond-protocol/functions/bond/repayment';

type RefinanceBondByLender = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  fbondPubkey: string;
  oracleFloor: string;
  hadoMarketPubkey: string;
  repayAccounts: RepayAccounts[];
}) => Promise<boolean>;

export const refinanceBondByLender: RefinanceBondByLender = async ({
  connection,
  wallet,
  fbondPubkey,
  oracleFloor,
  repayAccounts,
  hadoMarketPubkey,
}): Promise<boolean> => {
  const { instructions, signers } = await txn({
    programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
    connection,
    args: {
      nextBoxIndex: '0',
      bondFeatures: BondFeatures.None,
      repayAccounts,
    },
    addComputeUnits: true,
    accounts: {
      userPubkey: wallet.publicKey,
      fbond: new web3.PublicKey(fbondPubkey),
      oracleFloor: new web3.PublicKey(oracleFloor),
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
        message: 'Liquidated successfully!',
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
        transactionName: 'refinanceFbondByLender',
      });
    },
  });
};
