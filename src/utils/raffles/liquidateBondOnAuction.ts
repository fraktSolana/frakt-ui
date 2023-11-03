import {
  liquidateBondOnAuctionCnft,
  liquidateBondOnAuctionPnft,
} from 'fbonds-core/lib/fbond-protocol/functions/bond/liquidation';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { logTxnError, notify, sendTxnPlaceHolder } from './../index';
import { captureSentryTxnError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { showSolscanLinkNotification } from '../transactions';
import { InstructionsAndSigners } from 'fbonds-core/lib/fbond-protocol/types';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from 'fbonds-core/lib/fbond-protocol/utils';
import { RepayAccounts } from 'fbonds-core/lib/fbond-protocol/functions/bond/repayment';
import { EMPTY_PUBKEY } from 'fbonds-core/lib/fbond-protocol/constants';
import { CnftParams } from 'fbonds-core/lib/fbond-protocol/functions/bond/creation/createBondAndSellToOffersCnft';
import { chunk } from 'lodash';

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
  banxStakePubkey?: string;
  adventureSubscriptionsPubkeys?: {
    adventure: web3.PublicKey;
    adventureSubscription: web3.PublicKey;
  }[];
  cnftParams?: CnftParams;
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
  banxStakePubkey,
  adventureSubscriptionsPubkeys,
  cnftParams,
}): Promise<boolean> => {
  const { instructions, signers, addressesForLookupTable } = cnftParams
    ? await liquidateBondOnAuctionCnft({
        programId: new web3.PublicKey(process.env.BONDS_PROGRAM_PUBKEY),
        connection,
        // args: { repayAccounts },
        addComputeUnits: true,

        args: {
          cnftParams: cnftParams,
        },
        accounts: {
          userPubkey: wallet.publicKey,
          fbond: new web3.PublicKey(fbondPubkey),
          collateralBox: new web3.PublicKey(collateralBox),
          fraktMarket: new web3.PublicKey(fraktMarket),
          oracleFloor: new web3.PublicKey(oracleFloor),
          whitelistEntry: new web3.PublicKey(whitelistEntry),
          admin: new web3.PublicKey(process.env.BONDS_ADMIN_PUBKEY),
          repayAccounts: repayAccounts,
          tree: new web3.PublicKey(cnftParams.tree),
          nftMint: new web3.PublicKey(collateralTokenMint),
        },
        sendTxn: sendTxnPlaceHolder,
      })
    : await liquidateBondOnAuctionPnft({
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
          banxStake: banxStakePubkey
            ? new web3.PublicKey(banxStakePubkey)
            : EMPTY_PUBKEY,
          subscriptionsAndAdventures: [],
        },
        sendTxn: sendTxnPlaceHolder,
      });

  const slot = await connection.getSlot();

  console.log('INITIAL PASSED SLOT: ', slot);

  console.log('addressesForLookupTable: ', addressesForLookupTable);
  const [lookupTableInst, lookupTableAddress] =
    web3.AddressLookupTableProgram.createLookupTable({
      authority: wallet.publicKey,
      payer: wallet.publicKey,
      recentSlot: slot - 2,
    });
  const extendInstructions = chunk(addressesForLookupTable, 20).map(
    (chunkOfAddressesForLookupTable) =>
      web3.AddressLookupTableProgram.extendLookupTable({
        payer: wallet.publicKey,
        authority: wallet.publicKey,
        lookupTable: lookupTableAddress,
        addresses: chunkOfAddressesForLookupTable,
      }),
  );
  const createLookupTableTxn = new web3.Transaction().add(
    lookupTableInst,
    extendInstructions[0],
  );
  const restExtendInstructions = extendInstructions.slice(
    1,
    extendInstructions.length,
  );

  const restExtendTransactions = restExtendInstructions.map((extendIx) =>
    new web3.Transaction().add(extendIx),
  );

  const intstructionsAndSigners: InstructionsAndSigners = {
    instructions,
    signers,
    lookupTablePublicKeys: [],
  };
  if (addressesForLookupTable.length < 36)
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
          transactionName: 'liquidateBondOnAuction',
        });
      },
    });
  else
    return signAndSendV0TransactionWithLookupTablesSeparateSignatures({
      notBondTxns: [],
      createLookupTableTxns: [createLookupTableTxn],
      extendLookupTableTxns: [...restExtendTransactions],
      v0InstructionsAndSigners: [
        {
          instructions,
          signers,
          lookupTablePublicKeys: [
            {
              tablePubkey: lookupTableAddress,
              addresses: addressesForLookupTable,
            },
          ],
        },
      ],
      fastTrackInstructionsAndSigners: [],

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
          transactionName: 'liquidateBondOnAuction',
        });
      },
    });
};
