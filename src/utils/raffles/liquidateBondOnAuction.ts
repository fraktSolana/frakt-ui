import { liquidateBondOnAuction as txn } from 'fbonds-core/lib/fbond-protocol/functions/liquidation';
import { RepayAccounts } from 'fbonds-core/lib/fbond-protocol/functions/router';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { notify, sendTxnPlaceHolder } from './../index';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

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
  try {
    const { instructions, signers } = await txn({
      programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
      connection,
      args: { repayAccounts },
      accounts: {
        userPubkey: wallet.publicKey,
        fbond: new web3.PublicKey(fbondPubkey),
        collateralBox: new web3.PublicKey(collateralBox),
        collateralTokenMint: new web3.PublicKey(collateralTokenMint),
        collateralTokenAccount: new web3.PublicKey(collateralTokenAccount),
        collateralOwner:
          collateralOwner === 'escrowless'
            ? wallet.publicKey
            : new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
        fraktMarket: new web3.PublicKey(fraktMarket),
        oracleFloor: new web3.PublicKey(oracleFloor),
        whitelistEntry: new web3.PublicKey(whitelistEntry),
      },
      sendTxn: sendTxnPlaceHolder,
    });

    const transaction = new web3.Transaction().add(...instructions);

    await signAndConfirmTransaction({
      transaction,
      connection,
      signers,
      wallet,
    });

    notify({
      message: 'Transaction successful!',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'liquidateBondOnAuction',
    });

    return false;
  }
};
