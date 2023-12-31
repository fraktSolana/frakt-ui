import { Pair } from '@frakt/api/bonds';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import {
  BASE_POINTS,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS,
} from '../constants';
import {
  depositToBondOfferStandard,
  updateBondOfferStandard,
  withdrawFromBondOfferStandard,
} from 'fbonds-core/lib/fbond-protocol/functions/offer';

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

  const amountOfSolToUpdate = Math.abs(
    solDepositLamports - pair.fundsSolOrTokenBalance,
  );
  const standartMaxLoanValue = Math.ceil(
    (marketFloor *
      ((maxLTVRaw *
        (BASE_POINTS + BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS)) /
        BASE_POINTS)) /
      BASE_POINTS,
  );
  const maxReturnAmountFilter = maxLoanValueLamports || standartMaxLoanValue;

  const { instructions: instructions1, signers: signers1 } =
    await updateBondOfferStandard({
      accounts: {
        bondOfferV2: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        bidCap: 1000, //? 1 ORDER size. Amount of fBonds that user wants to buy
        delta: 0, //? Doesn't affect anything
        spotPrice, //? Price for decimal of fBond price (fBond --> Token that has BOND_SOL_DECIMAIL_DELTA decimals)
        loanToValueFilter: maxLTVRaw,
        maxDurationFilter: maxDurationSec,
        maxReturnAmountFilter: maxReturnAmountFilter,
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  const depositInstructionsAndSigners = [];

  if (
    !!amountOfSolToUpdate &&
    solDepositLamports > pair.fundsSolOrTokenBalance
  ) {
    const { instructions, signers } = await depositToBondOfferStandard({
      accounts: {
        bondOfferV2: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfSolToDeposit: amountOfSolToUpdate, //? Amount of BOND_SOL_DECIMAIL_DELTA parts of fBond token
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

    depositInstructionsAndSigners.push({ instructions, signers });
  }

  if (
    !!amountOfSolToUpdate &&
    solDepositLamports < pair.fundsSolOrTokenBalance
  ) {
    const { instructions, signers } = await withdrawFromBondOfferStandard({
      accounts: {
        bondOfferV2: new web3.PublicKey(pair.publicKey),
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfTokensToWithdraw: amountOfSolToUpdate, //? Amount of BOND_SOL_DECIMAIL_DELTA parts of fBond token
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

    depositInstructionsAndSigners.push({ instructions, signers });
  }

  return {
    transaction: new web3.Transaction().add(
      ...[
        instructions1,
        depositInstructionsAndSigners?.length
          ? depositInstructionsAndSigners[0]?.instructions
          : null,
      ]
        .filter((instructions) => instructions)
        .flat(),
    ),
    signers: [
      signers1,
      depositInstructionsAndSigners?.length
        ? depositInstructionsAndSigners[0]?.signers
        : null,
    ]
      .filter((signers) => signers)
      .flat(),
    accountsPublicKeys: {
      pairPubkey: new web3.PublicKey(pair?.publicKey),
    },
  };
};
