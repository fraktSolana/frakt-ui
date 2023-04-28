import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { fbondFactory } from 'fbonds-core/lib/fbond-protocol/functions';
import {
  validateAndSellNftToTokenToNftPair,
  validateAndSellToBondOffersV2,
} from 'fbonds-core/lib/fbond-protocol/functions/router';

import { Market, Pair, WhitelistType } from '@frakt/api/bonds';
import { BondCartOrder, getNftMerkleTreeProof } from '@frakt/api/nft';
import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '@frakt/utils';

import {
  BONDS_ADMIN_PUBKEY,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  PRECISION_CORRECTION_LAMPORTS,
} from '../constants';
import { isBondFeaturesAutomated, mergeBondOrderParamsByPair } from '../utils';
import { chunk } from 'lodash';
import { InstructionsAndSigners } from '@frakt/utils/transactions';

type MakeCreateBondTransaction = (params: {
  market: Market;
  pair: Pair;
  nftMint: string;
  borrowValue: number; //? lamports
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeCreateBondTransaction: MakeCreateBondTransaction = async ({
  market,
  pair,
  nftMint,
  borrowValue, //? lamports
  connection,
  wallet,
}) => {
  const amountToReturn =
    Math.trunc(borrowValue / pair.currentSpotPrice) * BOND_DECIMAL_DELTA;

  const proof = await (async () => {
    if (market.whitelistEntry?.whitelistType !== WhitelistType.MERKLE_TREE) {
      return [];
    }
    return await getNftMerkleTreeProof({ mint: new web3.PublicKey(nftMint) });
  })();

  const {
    fbond: bondPubkey,
    collateralBox: collateralBoxPubkey,
    fbondTokenMint: bondTokenMint,
    instructions: createBondIxns,
    signers: createBondSigners,
  } = await fbondFactory.createBondWithSingleCollateralPnft({
    accounts: {
      tokenMint: new web3.PublicKey(nftMint),
      userPubkey: wallet.publicKey,
    },
    args: {
      amountToDeposit: 1,
      amountToReturn: amountToReturn,
      bondDuration: pair.validation.durationFilter,
    },
    connection,
    programId: BONDS_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  const { instructions: validateAndsellIxs, signers: validateAndsellSigners } =
    await validateAndSellNftToTokenToNftPair({
      accounts: {
        collateralBox: collateralBoxPubkey,
        fbond: bondPubkey,
        fbondTokenMint: bondTokenMint,
        collateralTokenMint: new web3.PublicKey(nftMint),
        fraktMarket: new web3.PublicKey(market.fraktMarket.publicKey),
        oracleFloor: new web3.PublicKey(
          market.oracleFloor?.publicKey || PUBKEY_PLACEHOLDER,
        ),
        whitelistEntry: new web3.PublicKey(
          market.whitelistEntry?.publicKey || PUBKEY_PLACEHOLDER,
        ),
        hadoMarket: new web3.PublicKey(pair.hadoMarket),
        pair: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
        protocolFeeReceiver: new web3.PublicKey(
          BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER,
        ),
        assetReceiver: new web3.PublicKey(pair.assetReceiver),
      },
      args: {
        proof: proof,
        amountToSell: amountToReturn / BOND_DECIMAL_DELTA, //? amount of fbond tokens decimals
        minAmountToGet:
          (amountToReturn / BOND_DECIMAL_DELTA) * pair.currentSpotPrice, //? SOL lamports
        skipFailed: false,
        isAutocompoundOrAutoreceiveSol: isBondFeaturesAutomated(
          pair.validation.bondFeatures,
        ),
      },
      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(
      ...createBondIxns,
      ...validateAndsellIxs,
    ),
    signers: [createBondSigners, validateAndsellSigners].flat(),
  };
};

type MakeCreateBondMultiOrdersTransaction = (params: {
  market: Market;
  // bondOrder: BondOrder;
  bondOrderParams: BondCartOrder[];
  nftMint: string;

  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  createLookupTableTxn: web3.Transaction;
  extendLookupTableTxns: web3.Transaction[];
  createAndSellBondsIxsAndSigners: InstructionsAndSigners;
}>;

export const makeCreateBondMultiOrdersTransaction: MakeCreateBondMultiOrdersTransaction =
  async ({ market, bondOrderParams, nftMint, connection, wallet }) => {
    const amountToReturn =
      Math.trunc(
        bondOrderParams.reduce((sum, order) => sum + order.orderSize, 0),
      ) * BOND_DECIMAL_DELTA;

    const durationFilter = bondOrderParams.reduce(
      (smallestDurationParam, orderParams) =>
        smallestDurationParam.durationFilter < orderParams.durationFilter
          ? smallestDurationParam
          : orderParams,
    ).durationFilter;

    const {
      fbond: bondPubkey,
      collateralBox: collateralBoxPubkey,
      fbondTokenMint: bondTokenMint,
      instructions: createBondIxns,
      signers: createBondSigners,
      addressesForLookupTable,
    } = await fbondFactory.createBondWithSingleCollateralPnft({
      accounts: {
        tokenMint: new web3.PublicKey(nftMint),
        userPubkey: wallet.publicKey,
      },
      args: {
        amountToDeposit: 1,
        amountToReturn: amountToReturn,
        bondDuration: durationFilter,
      },
      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

    const mergedPairsOrderParams = mergeBondOrderParamsByPair({
      bondOrderParams,
    });

    const sellBondParamsAndAccounts = mergedPairsOrderParams.map(
      (orderParam) => ({
        minAmountToGet:
          orderParam.orderSize * orderParam.spotPrice -
          PRECISION_CORRECTION_LAMPORTS -
          Math.floor(Math.random() * 10000),
        amountToSell: orderParam.orderSize,
        bondOfferV2: new web3.PublicKey(orderParam.pairPubkey),
        assetReceiver: new web3.PublicKey(orderParam.assetReceiver),
      }),
    );

    const sellingBondsIxsAndSignersWithLookupAccounts =
      await validateAndSellToBondOffersV2({
        accounts: {
          collateralBox: collateralBoxPubkey,
          fbond: bondPubkey,
          fbondTokenMint: bondTokenMint,
          collateralTokenMint: new web3.PublicKey(nftMint),
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
          sellBondParamsAndAccounts,
        },
        connection,
        programId: BONDS_PROGRAM_PUBKEY,
        sendTxn: sendTxnPlaceHolder,
      });
    const slot = await connection.getSlot();

    console.log('INITIAL PASSED SLOT: ', slot);
    const combinedAddressesForLookupTable = [
      ...addressesForLookupTable,
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
      createAndSellBondsIxsAndSigners: {
        instructions: [
          ...createBondIxns,
          ...sellingBondsIxsAndSignersWithLookupAccounts.instructions,
        ],
        signers: [
          ...createBondSigners,
          ...sellingBondsIxsAndSignersWithLookupAccounts.signers,
        ],
        lookupTablePublicKeys: [
          {
            tablePubkey: lookupTableAddress,
            addresses: combinedAddressesForLookupTable,
          },
        ],
      },
    };
  };
