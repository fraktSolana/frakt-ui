import { Pair } from '@frakt/api/bonds';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { virtual as pairs } from 'fbonds-core/lib/fbond-protocol/functions/market-factory/pair';
import * as fBondsValidation from 'fbonds-core/lib/fbond-protocol/functions/validation';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { getTopOrderSize } from 'fbonds-core/lib/fbond-protocol/utils/cartManager';

import {
  BASE_POINTS,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS,
} from '../constants';
import { isBondFeaturesAutomated } from '../utils';

type MakeModifyPairTransactions = (params: {
  maxLTV: number; //? % 0-100
  maxDuration: number; //? days 7or14
  solDeposit: number; //? Amount of deposit in SOL. Normal values (F.e. 1, 20, 100)
  interest: number; //? % 0-Infinity
  marketFloor: number; //? % 0-Infinity
  maxLoanValue: number;
  connection: web3.Connection;
  wallet: WalletContextState;
  pair: Pair;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  accountsPublicKeys: {
    pairPubkey: web3.PublicKey;
    validationPubkey: web3.PublicKey;
    authorityAdapterPubkey: web3.PublicKey;
  };
}>;
export const makeModifyPairTransactions: MakeModifyPairTransactions = async ({
  solDeposit,
  interest,
  marketFloor,
  connection,
  wallet,
  pair,
  maxDuration,
  maxLTV,
  maxLoanValue,
}) => {
  const maxLTVRaw = maxLTV * 100; //? Max LTV (2000 --> 20%)
  const maxDurationSec = maxDuration * 24 * 60 * 60; //? Max duration (seconds)
  const maxLoanValueLamports = maxLoanValue * 1e9;

  const solDepositLamports = solDeposit * 1e9;
  const spotPrice = BOND_DECIMAL_DELTA - interest * 100;

  const bidCapMultiplier = isBondFeaturesAutomated(pair.validation.bondFeatures)
    ? 10
    : 1; // multiplying by 10, so autocompound
  const amountOfTokensInOrder = Math.floor(solDepositLamports / spotPrice);

  const bidCap = amountOfTokensInOrder * bidCapMultiplier;

  const topOrderSize = getTopOrderSize(pair);

  const amountTokenToUpdate = Math.abs(amountOfTokensInOrder - topOrderSize);
  const standartMaxLoanValue = Math.ceil(
    (marketFloor *
      ((maxLTVRaw *
        (BASE_POINTS + BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS)) /
        BASE_POINTS)) /
      BASE_POINTS,
  );
  const maxReturnAmountFilter = maxLoanValueLamports || standartMaxLoanValue;
  console.log({ maxReturnAmountFilter, marketFloor, maxLTVRaw });

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

  const depositInstructionsAndSigners = [];

  if (!!amountTokenToUpdate && amountOfTokensInOrder > topOrderSize) {
    const { instructions, signers } = await pairs.deposits.depositSolToPair({
      accounts: {
        authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
        pair: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfTokensToBuy: amountTokenToUpdate, //? Amount of BOND_SOL_DECIMAIL_DELTA parts of fBond token
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

    depositInstructionsAndSigners.push({ instructions, signers });
  }

  if (!!amountTokenToUpdate && amountOfTokensInOrder < topOrderSize) {
    const { instructions, signers } =
      await pairs.withdrawals.withdrawSolFromPair({
        accounts: {
          authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
          pair: new web3.PublicKey(pair.publicKey),
          userPubkey: wallet.publicKey,
        },
        args: {
          amountOfTokensToWithdraw: amountTokenToUpdate, //? Amount of BOND_SOL_DECIMAIL_DELTA parts of fBond token
        },
        programId: BONDS_PROGRAM_PUBKEY,
        connection,
        sendTxn: sendTxnPlaceHolder,
      });

    depositInstructionsAndSigners.push({ instructions, signers });
  }

  const { instructions: instructions2, signers: signers2 } =
    await fBondsValidation.updateValidationFilter({
      accounts: {
        authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
        pair: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        loanToValueFilter: maxLTVRaw,
        maxDurationFilter: maxDurationSec,
        maxReturnAmountFilter: maxReturnAmountFilter,
      },
      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(
      ...[
        instructions1,
        depositInstructionsAndSigners?.length
          ? depositInstructionsAndSigners[0]?.instructions
          : null,
        instructions2,
      ]
        .filter((instructions) => instructions)
        .flat(),
    ),
    signers: [
      signers1,
      depositInstructionsAndSigners?.length
        ? depositInstructionsAndSigners[0]?.signers
        : null,
      signers2,
    ]
      .filter((signers) => signers)
      .flat(),
    accountsPublicKeys: {
      pairPubkey: new web3.PublicKey(pair?.publicKey),
      validationPubkey: new web3.PublicKey(pair.validation?.publicKey),
      authorityAdapterPubkey: new web3.PublicKey(
        pair.authorityAdapterPublicKey,
      ),
    },
  };
};
