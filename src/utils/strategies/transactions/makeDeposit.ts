import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { web3 } from 'fbonds-core';
import { createInvestment } from 'fbonds-core/lib/bonds_trade_pool/functions/investment';
import { FRAKT_TRADE_PROGRAM_ID } from '../constants';

type MakeDeposit = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  amountToDeposit: string;
  tradePool: string;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  investment: web3.PublicKey;
}>;

export const makeDeposit: MakeDeposit = async ({
  connection,
  amountToDeposit,
  wallet,
  tradePool,
}) => {
  const { investment, instructions, signers } = await createInvestment({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      amountToDeposit: parseFloat(amountToDeposit) * 1e9,
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
