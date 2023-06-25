import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

import { Bond, Market, Pair, WhitelistType } from '@frakt/api/bonds';
import { BondCartOrder, getNftMerkleTreeProof } from '@frakt/api/nft';
import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '@frakt/utils';

import {
  BONDS_ADMIN_PUBKEY,
  BONDS_PROGRAM_PUBKEY,
  PRECISION_CORRECTION_LAMPORTS,
} from '../constants';
import { isBondFeaturesAutomated, mergeBondOrderParamsByPair } from '../utils';
import { InstructionsAndSigners } from '@frakt/utils/transactions';
import { chunk } from 'lodash';
import { exitValidateAndSellToBondOffersV2 } from 'fbonds-core/lib/fbond-protocol/functions/bond/resell';

type MakeExitBondMultiOrdersTransactionV2 = (params: {
  market: Market;
  // bondOrder: BondOrder;
  bondOrderParams: BondCartOrder[];
  bond: Bond;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  createLookupTableTxn: web3.Transaction;
  extendLookupTableTxns: web3.Transaction[];
  exitAndSellBondsIxsAndSigners: InstructionsAndSigners;
}>;

export const makeExitBondMultiOrdersTransactionV2: MakeExitBondMultiOrdersTransactionV2 =
  async ({ market, bondOrderParams, connection, bond, wallet }) => {
    const mergedPairsOrderParams = mergeBondOrderParamsByPair({
      bondOrderParams,
    });

    const sellBondParamsAndAccounts = mergedPairsOrderParams.map(
      (orderParam) => ({
        minAmountToGet: Math.max(
          Math.floor(
            orderParam.orderSize * orderParam.spotPrice -
              PRECISION_CORRECTION_LAMPORTS -
              Math.floor(Math.random() * 10000),
          ),
          0,
        ),
        amountToSell: Math.floor(orderParam.orderSize),
        bondOfferV2: new web3.PublicKey(orderParam.pairPubkey),
        assetReceiver: new web3.PublicKey(orderParam.assetReceiver),
      }),
    );

    const sellingBondsIxsAndSignersWithLookupAccounts =
      await exitValidateAndSellToBondOffersV2({
        accounts: {
          collateralBox: new web3.PublicKey(bond.collateralBox.publicKey),
          fbond: new web3.PublicKey(bond.fbond.publicKey),
          fbondTokenMint: new web3.PublicKey(bond.fbond.fbondTokenMint),
          collateralTokenMint: new web3.PublicKey(
            bond.collateralBox.collateralTokenMint,
          ),
          fraktMarket: new web3.PublicKey(market.fraktMarket.publicKey),
          oracleFloor: new web3.PublicKey(
            market.oracleFloor?.publicKey || PUBKEY_PLACEHOLDER,
          ),
          whitelistEntry: new web3.PublicKey(
            market.whitelistEntry?.publicKey || PUBKEY_PLACEHOLDER,
          ),
          hadoMarket: new web3.PublicKey(market.marketPubkey),
          userPubkey: wallet.publicKey,
          protocolFeeReceiver: new web3.PublicKey(
            BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER,
          ),
        },
        args: {
          sellBondParamsAndAccounts: sellBondParamsAndAccounts.filter(
            (param) => param.amountToSell > 0,
          ),
          userBondTradeTransactions: bond.autocompoundDeposits.map(
            (deposit) => new web3.PublicKey(deposit.publicKey),
          ),
        },
        connection,
        programId: BONDS_PROGRAM_PUBKEY,
        sendTxn: sendTxnPlaceHolder,
      });
    const slot = await connection.getSlot();

    console.log('INITIAL PASSED SLOT: ', slot);
    const combinedAddressesForLookupTable = [
      ...sellingBondsIxsAndSignersWithLookupAccounts.addressesForLookupTable,
    ];
    console.log(
      'combinedAddressesForLookupTable: ',
      combinedAddressesForLookupTable.length,
    );
    const [lookupTableInst, lookupTableAddress] =
      web3.AddressLookupTableProgram.createLookupTable({
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        recentSlot: slot - 2,
      });
    const extendInstructions = chunk(combinedAddressesForLookupTable, 20).map(
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

    return {
      createLookupTableTxn: createLookupTableTxn,
      extendLookupTableTxns: restExtendTransactions,
      exitAndSellBondsIxsAndSigners: {
        instructions: [
          ...sellingBondsIxsAndSignersWithLookupAccounts.instructions,
        ],
        signers: [...sellingBondsIxsAndSignersWithLookupAccounts.signers],
        lookupTablePublicKeys: [
          {
            tablePubkey: lookupTableAddress,
            addresses: combinedAddressesForLookupTable,
          },
        ],
      },
    };
  };
