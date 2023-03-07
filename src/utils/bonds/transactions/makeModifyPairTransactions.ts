import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { virtual as pairs } from 'fbonds-core/lib/fbond-protocol/functions/market-factory/pair';

import { BONDS_PROGRAM_PUBKEY, BOND_DECIMAL_DELTA } from '../constants';

type MakeModifyPairTransactions = (params: {
  solDeposit: number; //? Amount of deposit in SOL. Normal values (F.e. 1, 20, 100)
  interest: number; //? % 0-Infinity
  connection: web3.Connection;
  wallet: WalletContextState;
  pair: string;
  authorityAdapter: string;
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
  authorityAdapter,
}) => {
  const solDepositLamports = solDeposit * 1e9;

  const spotPrice = BOND_DECIMAL_DELTA - interest * 100;

  const bidCap = Math.floor(solDepositLamports / spotPrice);

  const { instructions: instructions1, signers: signers1 } =
    await pairs.mutations.modifyPair({
      accounts: {
        pair: new web3.PublicKey(pair),
        authorityAdapter: new web3.PublicKey(authorityAdapter),
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

  return {
    transaction: new web3.Transaction().add(...[instructions1].flat()),
    signers: [signers1].flat(),
  };
};
