// import { sendTxnPlaceHolder } from '@frakt/utils';
// import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
// import { WalletContextState } from '@solana/wallet-adapter-react';
// import { web3 } from 'fbonds-core';
// import { FRAKT_TRADE_PROGRAM_ID } from '../constants';
// import { FormValues } from '../types';

// type MakeUpdateStrategy = (params: {
//   connection: web3.Connection;
//   wallet: WalletContextState;
//   formValues: FormValues;
//   tradePool: string;
// }) => Promise<{
//   transaction: web3.Transaction;
//   signers: web3.Signer[];
//   tradeSettings: web3.PublicKey;
// }>;

// export const makeUpdateStrategy: MakeUpdateStrategy = async ({
//   connection,
//   wallet,
//   formValues,
//   tradePool,
// }) => {
//   const {
//     tradeSettings,
//     instructions: tradeSettingTxs,
//     signers: tradeSettingSigners,
//   } = await changeTradeSettings({
//     programId: FRAKT_TRADE_PROGRAM_ID,
//     connection: connection,
//     args: {
//       strategyNum: 1,
//       loanToValueFilter: +formValues.loanToValueFilter * 100,
//       durationFilter: +formValues.durationFilter * 86400,
//       delta: +formValues.delta * 100,
//       spotPrice: BOND_DECIMAL_DELTA - Number(formValues.spotPrice) * 100,
//       bidCap: +formValues.bidCap,
//       tradeAmountRatio: +formValues.utilizationRate * 100,
//       maxTradeAmount: +formValues.maxTradeAmount * 1e9,
//       minTimeBetweenTrades: +formValues.minTimeBetweenTrades,
//       bondingType: formValues.bondingType,
//       tradeDuration: +formValues.tradeDuration,
//       remainingSolRatioToFinishTrade:
//         +formValues.remainingSolRatioToFinishTrade * 100,
//     },
//     accounts: {
//       userPubkey: wallet?.publicKey,
//       hadoMarket: new web3.PublicKey(formValues.hadoMarkets.marketPubkey),
//       tradePool: new web3.PublicKey(tradePool),
//     },
//     sendTxn: sendTxnPlaceHolder,
//   });

//   return {
//     tradeSettings,
//     transaction: new web3.Transaction().add(...[tradeSettingTxs].flat()),
//     signers: [tradeSettingSigners].flat(),
//   };
// };
export {};
