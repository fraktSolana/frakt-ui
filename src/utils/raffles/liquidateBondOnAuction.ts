import { liquidateBondOnAuction as txn } from 'fbonds-core/lib/fbond-protocol/functions/liquidation';

import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { notify, sendTxnPlaceHolder } from './../index';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type BuyAuctionBond = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  raffleAddress: string;
  nftMint: string;
  fbond: string;
}) => Promise<boolean>;

export const LiquidateBondOnAuction: BuyAuctionBond = async ({
  connection,
  wallet,
  fbond,
}): Promise<boolean> => {
  try {
    const { instructions, signers } = await txn({
      programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
      connection,
      args: {
        repayAccounts: [],
      },
      accounts: {
        userPubkey: wallet.publicKey,
        fbond: new web3.PublicKey(fbond),
        collateralBox: new web3.PublicKey(fbond),
        collateralTokenMint: new web3.PublicKey(fbond),
        collateralTokenAccount: new web3.PublicKey(fbond),
        collateralOwner: new web3.PublicKey(fbond), // ? if (type===ecrow) BONDS_PROGRAM_PUBKEY  if(type=== ecrowles) wallet.publicKey
        fraktMarket: new web3.PublicKey(fbond),
        oracleFloor: new web3.PublicKey(fbond),
        whitelistEntry: new web3.PublicKey(fbond),
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
