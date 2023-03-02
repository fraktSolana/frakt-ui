import { sendTxnPlaceHolder } from '@frakt/utils';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { changeTradeSettings } from 'fbonds-core/lib/bonds_trade_pool/functions/pool-factory';
import { BondingCurveType } from 'fbonds-core/lib/fbond-protocol/types';
import { FormValues } from '../types';

type MakeUpdateStrategy = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  formValues: FormValues;
  tradePool;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  tradeSettings;
}>;

export const makeUpdateStrategy: MakeUpdateStrategy = async ({
  connection,
  wallet,
  formValues,
  tradePool,
}) => {
  const programID = 'bondPKoXiaX83eJeCKY2VVDrRygkaFhjqZVbHsdDC4T';

  const FRAKT_TRADE_PROGRAM_ID = new web3.PublicKey(programID);

  console.log('new web3.PublicKey(tradePool)', new web3.PublicKey(tradePool));

  // const sendTxnUser = async (txn, signers) =>
  //   void (await connection
  //     .sendTransaction(txn, [wallet, ...signers])
  //     .catch((err) => console.log(err)));

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
      spotPrice: BOND_DECIMAL_DELTA - Number(formValues.interest) * 100,
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
      tradePool: new web3.PublicKey(tradePool),
    },
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    tradeSettings,
    transaction: new web3.Transaction().add(...[tradeSettingTxs].flat()),
    signers: [tradeSettingSigners].flat(),
  };
};
