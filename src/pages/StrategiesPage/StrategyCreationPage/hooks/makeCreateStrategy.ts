import { sendTxnPlaceHolder } from '@frakt/utils';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import {
  changeTradeSettings,
  initializeTradePool,
} from 'fbonds-core/lib/bonds_trade_pool/functions/pool-factory';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import { FormValues } from '../types';

type MakeCreateStrategy = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  formValues: FormValues;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  tradeSettings;
  tradePool;
}>;

export const makeCreateStrategy: MakeCreateStrategy = async ({
  connection,
  wallet,
  formValues,
}) => {
  const tradeAuthority = '7JxVxxLTDkra9E3y7SZxuunmgeGzL7vzUQj55PFxfguT';
  const programID = 'bondPKoXiaX83eJeCKY2VVDrRygkaFhjqZVbHsdDC4T';

  const FRAKT_TRADE_AUTHORITY = new web3.PublicKey(tradeAuthority);

  const FRAKT_TRADE_PROGRAM_ID = new web3.PublicKey(programID);

  ///reserveFundsRatio = utilizationRate
  const {
    tradePool,
    instructions: tradePoolTxn,
    signers: tradePoolSigners,
  } = await initializeTradePool({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      reserveFundsRatio: 20 * 100,
      isPrivate: false,
    },
    accounts: {
      userPubkey: wallet?.publicKey,
      tradeAuthority: FRAKT_TRADE_AUTHORITY,
    },
    sendTxn: sendTxnPlaceHolder,
  });

  const deltaParsed =
    formValues.bondingType === BondingCurveType.Linear
      ? +formValues.delta * 1e9
      : +formValues.delta * 100;

  const {
    tradeSettings,
    instructions: tradeSettingTxs,
    signers: tradeSettingSigners,
  } = await changeTradeSettings({
    programId: FRAKT_TRADE_PROGRAM_ID,
    connection: connection,
    args: {
      strategyNum: 1,
      loanToValueFilter: +formValues.loanToValueFilter * 100,
      durationFilter: +formValues.durationFilter * 86400,
      delta: deltaParsed,
      spotPrice: BOND_DECIMAL_DELTA - Number(formValues.spotPrice) * 100,
      bidCap: +formValues.bidCap,
      tradeAmountRatio: +formValues.utilizationRate * 100,
      maxTradeAmount: +formValues.maxTradeAmount * 1e9,
      minTimeBetweenTrades: +formValues.minTimeBetweenTrades,
      bondingType: formValues.bondingType,
      tradeDuration: +formValues.tradeDuration,
      remainingSolRatioToFinishTrade:
        +formValues.remainingSolRatioToFinishTrade * 100,
    },
    accounts: {
      userPubkey: wallet?.publicKey,
      hadoMarket: new web3.PublicKey(formValues.hadoMarkets.marketPubkey),
      tradePool: tradePool,
    },
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    tradePool,
    tradeSettings,
    transaction: new web3.Transaction().add(
      ...[tradePoolTxn, tradeSettingTxs].flat(),
    ),
    signers: [tradePoolSigners, tradeSettingSigners].flat(),
  };
};
