import { liquidateBondOnAuctionPnft as txn } from 'fbonds-core/lib/fbond-protocol/functions/bond/liquidation';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { notify, sendTxnPlaceHolder } from './../index';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { InstructionsAndSigners } from 'fbonds-core/lib/fbond-protocol/types';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';
import { RepayAccounts } from 'fbonds-core/lib/fbond-protocol/functions/bond/repayment';
import { EMPTY_PUBKEY } from 'fbonds-core/lib/fbond-protocol/constants';

type LiquidateBondOnAuction = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  fbondPubkey: string;
  collateralBox: string;
  collateralBoxType: string;
  collateralTokenMint: string;
  collateralTokenAccount: string;
  collateralOwner: string;
  fraktMarket: string;
  oracleFloor: string;
  whitelistEntry: string;
  repayAccounts: RepayAccounts[];
}) => Promise<boolean>;

export const liquidateBondOnAuction: LiquidateBondOnAuction = async ({
  connection,
  wallet,
  fbondPubkey,
  collateralBox,
  collateralTokenMint,
  collateralTokenAccount,
  collateralOwner,
  fraktMarket,
  oracleFloor,
  whitelistEntry,
  repayAccounts,
}): Promise<boolean> => {
  const { instructions, signers } = await txn({
    programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
    connection,
    // args: { repayAccounts },
    addComputeUnits: true,
    accounts: {
      userPubkey: wallet.publicKey,
      fbond: new web3.PublicKey(fbondPubkey),
      collateralBox: new web3.PublicKey(collateralBox),
      collateralTokenMint: new web3.PublicKey(collateralTokenMint),
      collateralTokenAccount: new web3.PublicKey(collateralTokenAccount),
      collateralOwner: new web3.PublicKey(collateralOwner),
      fraktMarket: new web3.PublicKey(fraktMarket),
      oracleFloor: new web3.PublicKey(oracleFloor),
      whitelistEntry: new web3.PublicKey(whitelistEntry),
      admin: new web3.PublicKey(process.env.BONDS_ADMIN_PUBKEY),
      repayAccounts: repayAccounts,
      banxStake: EMPTY_PUBKEY,
      subscriptionsAndAdventures: [],
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
        transactionName: 'liquidateBondOnAuction',
      });
    },
  });
};
