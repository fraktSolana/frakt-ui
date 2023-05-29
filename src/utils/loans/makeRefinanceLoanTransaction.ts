import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  refinanceFBondPnft,
  refinanceToBondOffersV2,
} from 'fbonds-core/lib/fbond-protocol/functions/management';
import { getTopOrderSize } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';
import {
  isBondFeaturesAutomated,
  mergeBondOrderParamsByPair,
} from '../bonds/utils';
import {
  BOND_DECIMAL_DELTA,
  PRECISION_CORRECTION_LAMPORTS,
} from '../bonds/constants';

import { Market, Pair } from '@frakt/api/bonds';
import { Loan } from '@frakt/api/loans';
import { BondCartOrder, getNftMerkleTreeProof } from '@frakt/api/nft';
import { InstructionsAndSigners } from '@frakt/utils/transactions';

import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '..';
import { BONDS_ADMIN_PUBKEY, BONDS_PROGRAM_PUBKEY } from '../bonds';
import { chunk } from 'lodash';

type MakeRefinanceLoanTransaction = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  bondOrderParams: BondCartOrder[];

  loan: Loan;
  market: Market;
}) => Promise<{
  createLookupTableTxn: web3.Transaction;
  extendLookupTableTxns: web3.Transaction[];
  refinanceIxsAndSigners: InstructionsAndSigners;
}>;

export const makeRefinanceLoanTransaction: MakeRefinanceLoanTransaction =
  async ({
    connection,
    wallet,
    bondOrderParams,
    loan,
    market,
  }): Promise<any> => {
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

    const mergedPairsOrderParams = mergeBondOrderParamsByPair({
      bondOrderParams,
    });

    const sellBondParamsAndAccounts = mergedPairsOrderParams.map(
      (orderParam) => ({
        minAmountToGet: Math.max(
          Math.floor(
            orderParam.orderSize * orderParam.spotPrice -
              PRECISION_CORRECTION_LAMPORTS,
          ),
          0,
        ),
        amountToSell: orderParam.orderSize,
        bondOfferV2: new web3.PublicKey(orderParam.pairPubkey),
        assetReceiver: new web3.PublicKey(orderParam.assetReceiver),
      }),
    );
    console.log('sellBondParamsAndAccounts: ', sellBondParamsAndAccounts);
    console.log('currentLoan: ', loan);
    const {
      instructions,
      signers,
      fbond,
      fbondTokenMint,
      collateralBox,
      addressesForLookupTable,
    } = await refinanceToBondOffersV2({
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      args: {
        nextBoxIndex: '0',
        amountToReturn,
        bondDuration: durationFilter,
        sellBondParamsAndAccounts: sellBondParamsAndAccounts,
        repayAccounts: loan.bondParams.activeTrades.map((trade) => ({
          bondTradeTransaction: new web3.PublicKey(trade.publicKey),
          user: new web3.PublicKey(trade.user),
          bondOffer: new web3.PublicKey(trade.bondOffer),
        })),
      },
      accounts: {
        userPubkey: wallet?.publicKey,
        fbond: new web3.PublicKey(loan.pubkey),
        collateralTokenMint: new web3.PublicKey(loan.nft.mint),
        collateralTokenAccount: new web3.PublicKey(
          loan.bondParams.collateralTokenAccount,
        ),
        fbondsTokenMint: new web3.PublicKey(loan.bondParams.bondTokenMint),
        adminPubkey: BONDS_ADMIN_PUBKEY,

        fraktMarket: new web3.PublicKey(market.fraktMarket.publicKey),
        oracleFloor: new web3.PublicKey(
          market.oracleFloor?.publicKey || PUBKEY_PLACEHOLDER,
        ),
        whitelistEntry: new web3.PublicKey(
          market.whitelistEntry?.publicKey || PUBKEY_PLACEHOLDER,
        ),
        hadoMarket: new web3.PublicKey(market.marketPubkey),

        protocolFeeReceiver: new web3.PublicKey(
          BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER,
        ),
      },
      addComputeUnits: true,
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

    return {
      createLookupTableTxn: createLookupTableTxn,
      extendLookupTableTxns: restExtendTransactions,
      refinanceIxsAndSigners: {
        instructions,
        signers,
        lookupTablePublicKeys: [
          {
            tablePubkey: lookupTableAddress,
            addresses: addressesForLookupTable,
          },
        ],
      },
    };
  };
