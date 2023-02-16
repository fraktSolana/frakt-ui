import { PUBKEY_PLACEHOLDER, sendTxnPlaceHolder } from '@frakt/utils';
import { web3 } from 'fbonds-core';
import {
  changeTradeSettings,
  initializeTradePool,
} from 'fbonds-core/lib/bonds_trade_pool/functions/pool-factory';

type MakeCreateStrategy = (params: {
  connection;
  wallet;
  formValues;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeCreateStrategy: MakeCreateStrategy = async ({
  connection,
  wallet,
  formValues,
}) => {
  const tradeAuthority = '7JxVxxLTDkra9E3y7SZxuunmgeGzL7vzUQj55PFxfguT';
  const programID = '78cc3gsyToWu2dDgDdoLjTkR2j81zCnXnZLAzT8mWVMF';

  const FRAKT_TRADE_AUTHORITY = new web3.PublicKey(
    tradeAuthority || PUBKEY_PLACEHOLDER,
  );

  const FRAKT_TRADE_PROGRAM_ID = new web3.PublicKey(
    programID || PUBKEY_PLACEHOLDER,
  );

  const {
    tradePool,
    instructions: tradePoolTxn,
    signers: tradePoolSigners,
  } = await initializeTradePool({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      reserveFundsRatio: parseFloat(formValues.utilizationRate),
    },
    accounts: {
      userPubkey: wallet.publicKey,
      tradeAuthority: FRAKT_TRADE_AUTHORITY,
    },
    sendTxn: sendTxnPlaceHolder,
  });

  const {
    tradeSettings,
    instructions: tradeSettingTxs,
    signers: tradeSettingSigners,
  } = await changeTradeSettings({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      strategyNum: 1,
      loanToValueFilter: formValues.maxLTV,
      durationFilter: formValues.duration,
      delta: formValues.delta,
      spotPrice: formValues.spotPrice,
      bidCap: formValues.bidCap,
      tradeAmountRatio: formValues.tradeAmountRatio,
      maxTradeAmount: formValues.tradeAmountRatio,
      minTimeBetweenTrades: formValues.minTimeBetweenTrades,
      bondingType: formValues.bondingCurve,
      tradeDuration: formValues.tradeDuration,
      remainingSolRatioToFinishTrade: formValues.tradeAmountRatio,
    },
    accounts: {
      userPubkey: wallet.publicKey,
      hadoMarket: formValues.selectedMarket,
      tradePool: tradePool,
    },
    sendTxn: sendTxnPlaceHolder,
  });

  console.log(tradeSettings);

  return {
    transaction: new web3.Transaction().add(
      ...tradePoolTxn,
      ...tradeSettingTxs,
    ),
    signers: [tradePoolSigners, tradeSettingSigners].flat(),
  };
};
