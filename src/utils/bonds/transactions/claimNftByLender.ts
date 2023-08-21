import {
  claimNftByLenderCnft,
  claimNftByLenderPnft,
} from 'fbonds-core/lib/fbond-protocol/functions/bond/liquidation';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';

import { logTxnError, notify, sendTxnPlaceHolder } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryTxnError } from '@frakt/utils/sentry';
import { Bond } from '@frakt/api/bonds';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';

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
  const { fbond, collateralBox, autocompoundDeposits } = bond;

  const { instructions, signers } = collateralBox.nft.cnftParams
    ? await claimNftByLenderCnft({
        programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
        connection,
        addComputeUnits: true,

        args: {
          cnftParams: collateralBox.nft.cnftParams,
        },
        accounts: {
          userPubkey: wallet.publicKey,
          fbond: new web3.PublicKey(fbond.publicKey),
          collateralBox: new web3.PublicKey(collateralBox.publicKey),
          nftMint: new web3.PublicKey(collateralBox.collateralTokenMint),
          bondTradeTransactionV2: new web3.PublicKey(
            autocompoundDeposits[0].publicKey,
          ),
          tree: new web3.PublicKey(collateralBox.nft.cnftParams.tree),
        },
        sendTxn: sendTxnPlaceHolder,
      })
    : await claimNftByLenderPnft({
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
          banxStake: new web3.PublicKey(bond.fbond.banxStake),
          subscriptionsAndAdventures: bond.adventureSubscriptions.map(
            (subscription) => ({
              adventureSubscription: new web3.PublicKey(subscription.publicKey),
              adventure: new web3.PublicKey(subscription.adventure),
            }),
          ),
        },
        sendTxn: sendTxnPlaceHolder,
      });
  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    skipTimeout: true,
    notBondTxns: [],
    createLookupTableTxns: [],
    extendLookupTableTxns: [],
    v0InstructionsAndSigners: [],
    fastTrackInstructionsAndSigners: [
      {
        instructions,
        signers,
        lookupTablePublicKeys: [],
      },
    ],
    connection,
    wallet,
    commitment: 'confirmed',
    onAfterSend,
    onSuccess: () => {
      notify({
        message: 'Claim Nft successfully!',
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
        transactionName: 'claimNftByLender',
      });
    },
  });
};
