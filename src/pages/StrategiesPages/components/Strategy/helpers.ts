import { TradePoolUser } from '@frakt/api/strategies';

export const calcWithdrawValue = (tradePool: TradePoolUser) => {
  const userLiquidity = tradePool?.wallet?.userLiquidity;

  const availableToWithdraw = Math.min(
    (tradePool?.reserveFundsRatio * tradePool?.balance) / 1e4,
    userLiquidity,
  );

  const withdrawValueLamports =
    availableToWithdraw < 1e7 ? 0 : availableToWithdraw;

  return withdrawValueLamports / 1e9 || 0;
};
