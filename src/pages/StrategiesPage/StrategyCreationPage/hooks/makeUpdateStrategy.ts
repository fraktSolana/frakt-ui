import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { changeTradeSettings } from 'fbonds-core/lib/bonds_trade_pool/functions/pool-factory';
import { FormValues } from '../types';

type MakeUpdateStrategy = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  formValues: FormValues;
  tradePool;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeUpdateStrategy: MakeUpdateStrategy = async ({
  connection,
  wallet,
  formValues,
  tradePool,
}) => {
  const programID = 'bondPKoXiaX83eJeCKY2VVDrRygkaFhjqZVbHsdDC4T';

  const FRAKT_TRADE_PROGRAM_ID = new web3.PublicKey(programID);

  const {
    tradeSettings,
    instructions: tradeSettingTxs,
    signers: tradeSettingSigners,
  } = await changeTradeSettings({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      strategyNum: 1,
      loanToValueFilter: +formValues.maxLTV * 100,
      durationFilter: +formValues.duration * 86400,
      delta: +formValues.delta * 1e9,
      spotPrice: +formValues.spotPrice * 1e9,
      bidCap: +formValues.bidCap,
      tradeAmountRatio: +formValues.utilizationRate * 100,
      maxTradeAmount: +formValues.maxTradeAmount * 1e9,
      minTimeBetweenTrades: +formValues.minTimeBetweenTrades,
      bondingType: formValues.bondingCurve,
      tradeDuration: +formValues.tradeDuration,
      remainingSolRatioToFinishTrade:
        +formValues.remainingSolRatioToFinishTrade * 100,
    },
    accounts: {
      userPubkey: wallet?.publicKey,
      hadoMarket: new web3.PublicKey(formValues.selectedMarket.marketPubkey),
      tradePool: tradePool,
    },
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    transaction: new web3.Transaction().add(...[tradeSettingTxs].flat()),
    signers: [tradeSettingSigners].flat(),
  };
};
