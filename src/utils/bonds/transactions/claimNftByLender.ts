import { claimNftByLenderPnft as txn } from 'fbonds-core/lib/fbond-protocol/functions/bond/liquidation';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '@frakt/utils/transactions';

import { notify, sendTxnPlaceHolder } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { Bond } from '@frakt/api/bonds';
import { EMPTY_PUBKEY } from 'fbonds-core/lib/fbond-protocol/constants';

type ClaimNftByLender = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  bond: Bond;
  onAfterSend?: () => void;
}) => Promise<boolean>;

export const claimNftByLender: ClaimNftByLender = async ({
  connection,
  wallet,
  bond,
  onAfterSend,
}): Promise<boolean> => {
  try {
    const { fbond, collateralBox, autocompoundDeposits } = bond;

    const { instructions, signers } = await txn({
      programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
      connection,
      addComputeUnits: true,
      accounts: {
        userPubkey: wallet.publicKey,
        fbond: new web3.PublicKey(fbond.publicKey),
        collateralBox: new web3.PublicKey(collateralBox.publicKey),
        collateralTokenMint: new web3.PublicKey(
          collateralBox.collateralTokenMint,
        ),
        collateralTokenAccount: new web3.PublicKey(
          collateralBox.collateralTokenAccount,
        ),
        collateralOwner: new web3.PublicKey(fbond.fbondIssuer),
        bondTradeTransactionV2: new web3.PublicKey(
          autocompoundDeposits[0].publicKey,
        ),
        banxStake: EMPTY_PUBKEY,
        subscriptionsAndAdventures: [],
      },
      sendTxn: sendTxnPlaceHolder,
    });

    const transaction = new web3.Transaction().add(...instructions);

    await signAndConfirmTransaction({
      transaction,
      onAfterSend,
      signers,
      connection,
      wallet,
    });

    notify({
      message: 'Claim Nft successfully!',
      type: NotifyType.SUCCESS,
    });

    return true;
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
      transactionName: 'claimNftByLender',
    });

    return false;
  }
};
