import { sendTxnPlaceHolder } from '@frakt/utils';
import { PublicKey } from '@solana/web3.js';
import { web3 } from 'fbonds-core';
import { createInvestment } from 'fbonds-core/lib/bonds_trade_pool/functions/investment';

export const makeDeposit = async ({
  connection,
  amountToDeposit,
  wallet,
  tradePool,
}) => {
  const tradeAuthority = '7JxVxxLTDkra9E3y7SZxuunmgeGzL7vzUQj55PFxfguT';
  const programID = 'bondPKoXiaX83eJeCKY2VVDrRygkaFhjqZVbHsdDC4T';

  const FRAKT_TRADE_AUTHORITY = new web3.PublicKey(tradeAuthority);

  const FRAKT_TRADE_PROGRAM_ID = new web3.PublicKey(programID);
  const { investment, instructions, signers } = await createInvestment({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      amountToDeposit: amountToDeposit,
    },
    accounts: {
      userPubkey: wallet?.PublicKey,
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
