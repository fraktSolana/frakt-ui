import { sum, map } from 'lodash';
import { web3 } from 'fbonds-core';

import { formatNumber } from '@frakt/utils/solanaUtils';
import { UserRewards } from '@frakt/api/user/types';

const getUserRewardsValue = (usersRewards: UserRewards) => {
  if (!usersRewards) return '--';

  const { lenders, borrowers } = usersRewards;
  const unitedUserRewards = [...lenders, ...borrowers];

  const totalUserRewards = sum(map(unitedUserRewards, 'reward')) || 0;

  return totalUserRewards.toFixed(2);
};

const formatSolUserBalance = (account: web3.AccountInfo<Buffer>): string => {
  const solValue = (account?.lamports || 0) / web3.LAMPORTS_PER_SOL;

  const formatedSolValue = `${formatNumber.format(solValue)}`;

  return formatedSolValue;
};

export { getUserRewardsValue, formatSolUserBalance };
