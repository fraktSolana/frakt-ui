import { Pair } from '@frakt/api/bonds';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { virtual as pairs } from 'fbonds-core/lib/fbond-protocol/functions/market-factory/pair';
import * as fBondsValidation from 'fbonds-core/lib/fbond-protocol/functions/validation';
import { getTopOrderSize } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';

import { BONDS_PROGRAM_PUBKEY, BOND_DECIMAL_DELTA } from '../constants';

type MakeModifyPairTransactions = (params: {
  maxLTV: number; //? % 0-100
  maxDuration: number; //? days 7or14
  solDeposit: number; //? Amount of deposit in SOL. Normal values (F.e. 1, 20, 100)
  interest: number; //? % 0-Infinity
  connection: web3.Connection;
  wallet: WalletContextState;
  pair: Pair;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;
export const makeModifyPairTransactions: MakeModifyPairTransactions = async ({
  solDeposit,
  interest,
  connection,
  wallet,
  pair,
  maxDuration,
  maxLTV,
}) => {
  const maxLTVRaw = maxLTV * 100; //? Max LTV (2000 --> 20%)
  const maxDurationSec = maxDuration * 24 * 60 * 60; //? Max duration (seconds)

  const solDepositLamports = solDeposit * 1e9;

  const newTokenAmount = solDepositLamports / pair.currentSpotPrice;

  const spotPrice = BOND_DECIMAL_DELTA - interest * 100;
  const bidCap = Math.floor(solDepositLamports / spotPrice);

  const topOrderSize = getTopOrderSize({
    edgeSettlement: pair.edgeSettlement,
    bidCap: pair.bidCap,
    bidSettlement: pair.bidSettlement,
    buyOrdersQuantity: pair.buyOrdersQuantity,
  });

  const depositInstructionsAndSigners = [];

  if (newTokenAmount > topOrderSize) {
    const { instructions, signers } = await pairs.deposits.depositSolToPair({
      accounts: {
        authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
        pair: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfTokensToBuy: bidCap, //? Amount of BOND_SOL_DECIMAIL_DELTA parts of fBond token
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

    depositInstructionsAndSigners.push({ instructions, signers });
  } else {
    const { instructions, signers } =
      await pairs.withdrawals.withdrawSolFromPair({
        accounts: {
          authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
          pair: new web3.PublicKey(pair.publicKey),
          userPubkey: wallet.publicKey,
        },
        args: {
          amountOfTokensToWithdraw: bidCap, //? Amount of BOND_SOL_DECIMAIL_DELTA parts of fBond token
        },
        programId: BONDS_PROGRAM_PUBKEY,
        connection,
        sendTxn: sendTxnPlaceHolder,
      });

    depositInstructionsAndSigners.push({ instructions, signers });
  }

  const { instructions: instructions1, signers: signers1 } =
    await pairs.mutations.modifyPair({
      accounts: {
        pair: new web3.PublicKey(pair.publicKey),
        authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        bidCap, //? 1 ORDER size. Amount of fBonds that user wants to buy
        delta: 0, //? Doesn't affect anything
        fee: 0, //? Doesn't affect anything
        spotPrice, //? Price for decimal of fBond price (fBond --> Token that has BOND_SOL_DECIMAIL_DELTA decimals)
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  // const { instructions: instructions2, signers: signers2 } =
  //   await fBondsValidation.updateValidationFilter({
  //     accounts: {
  //       authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
  //       validation: new web3.PublicKey(pair.validation.publicKey),
  //       userPubkey: wallet.publicKey,
  //     },
  //     args: {
  //       loanToValueFilter: maxLTVRaw,
  //       maxDurationFilter: maxDurationSec,
  //     },
  //     connection,
  //     programId: BONDS_PROGRAM_PUBKEY,
  //     sendTxn: sendTxnPlaceHolder,
  //   });

  return {
    transaction: new web3.Transaction().add(
      ...[
        instructions1,
        // instructions2,
        depositInstructionsAndSigners[0]?.instructions,
      ].flat(),
    ),
    signers: [
      signers1,
      // signers2,
      depositInstructionsAndSigners[0]?.signers,
    ].flat(),
  };
};
