export const getWithdrawValue = (availableToWithdraw: number) => {
  return (availableToWithdraw < 1e7 ? 0 : availableToWithdraw) / 1e9 || 0;
};

export const getUtilizationRate = (reserveFundsRatio: number) => {
  return (1e4 - reserveFundsRatio) / 100;
};
