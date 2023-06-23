import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import {
  BondFeatures,
  BondingCurveType,
  PairType,
} from 'fbonds-core/lib/fbond-protocol/types';

import {
  BASE_POINTS,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  BOND_MAX_RETURN_AMOUNT_FILTER,
  BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS,
} from '../constants';
import { isBondFeaturesAutomated } from '../utils';
import {
  createBondOfferStandard,
  createBondOfferV2,
} from 'fbonds-core/lib/fbond-protocol/functions/offer';

type MakeCreatePairTransaction = (params: {
  maxLTV: number; //? % 0-100
  maxDuration: number; //? days 7or14
  maxLoanValue: number; //? Max loan value in SOL. Normal values (F.e. 1, 20, 100)
  solDeposit: number; //? Amount of deposit in SOL. Normal values (F.e. 1, 20, 100)
  interest: number; //? % 0-Infinity
  marketFloor: number; //? % 0-Infinity
  marketPubkey: web3.PublicKey;
  bondFeature?: BondFeatures;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  accountsPublicKeys: {
    pairPubkey: web3.PublicKey;
  };
}>;
export const makeCreatePairTransaction: MakeCreatePairTransaction = async ({
  maxLTV,
  maxDuration,
  maxLoanValue,
  solDeposit,
  interest,
  marketFloor,
  marketPubkey,
  bondFeature = BondFeatures.AutoreceiveSol,
  connection,
  wallet,
}) => {
  console.log('bondFeature: ', bondFeature);
  const maxLTVRaw = maxLTV * 100; //? Max LTV (2000 --> 20%)
  const maxDurationSec = maxDuration * 24 * 60 * 60; //? Max duration (seconds)
  const solDepositLamports = solDeposit * 1e9;
  console.log('solDepositLamports: ', solDepositLamports);
  const maxLoanValueLamports = maxLoanValue * 1e9;

  const spotPrice = BOND_DECIMAL_DELTA - interest * 100;

  const standartMaxLoanValue = Math.ceil(
    (marketFloor *
      ((maxLTVRaw *
        (BASE_POINTS + BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS)) /
        BASE_POINTS)) /
      BASE_POINTS,
  );
  const maxReturnAmountFilter = maxLoanValueLamports || standartMaxLoanValue;
  console.log({ maxReturnAmountFilter, marketFloor, maxLTVRaw });

  const {
    instructions: instructions1,
    signers: signers1,
    bondOfferV2: pairPubkey,
  } = await createBondOfferStandard({
    accounts: {
      hadoMarket: marketPubkey,
      userPubkey: wallet.publicKey,
    },
    args: {
      bidCap: 0, //? 1 ORDER size. Amount of fBonds that user wants to buy
      bondingCurveType: BondingCurveType.Linear, //? Doesn't affect anything
      delta: 0, //? Doesn't affect anything
      spotPrice: spotPrice, //? Price for decimal of fBond price (fBond --> Token that has BOND_SOL_DECIMAIL_DELTA decimals)
      amountOfSolToDeposit: solDepositLamports,
      loanToValueFilter: maxLTVRaw,
      maxDurationFilter: maxDurationSec,
      maxReturnAmountFilter: maxReturnAmountFilter,
      bondFeatures: bondFeature,
    },
    programId: BONDS_PROGRAM_PUBKEY,
    connection,
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    transaction: new web3.Transaction().add(...[instructions1].flat()),
    signers: [signers1].flat(),
    accountsPublicKeys: {
      pairPubkey,
    },
  };
};
