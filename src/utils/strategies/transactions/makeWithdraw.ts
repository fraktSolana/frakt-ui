import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { web3 } from 'fbonds-core';
import { unstakeFromPool } from 'fbonds-core/lib/bonds_trade_pool/functions/investment';
import { FRAKT_TRADE_PROGRAM_ID } from '../constants';

type MakeWithdraw = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  amountToUnstake: string;
  tradePool: string;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  investment: web3.PublicKey;
}>;

export const makeWithdraw: MakeWithdraw = async ({
  connection,
  amountToUnstake,
  wallet,
  tradePool,
}) => {
  const { investment, instructions, signers } = await unstakeFromPool({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      amountToUnstake: parseFloat(amountToUnstake) * 1e9,
    },
    accounts: {
      userPubkey: wallet?.publicKey,
      tradePool: new PublicKey(tradePool),
    },
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    investment,
    transaction: new web3.Transaction().add(...[instructions].flat()),
    signers: [signers].flat(),
  };
};
