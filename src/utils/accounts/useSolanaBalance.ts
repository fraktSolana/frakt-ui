import { web3 } from 'fbonds-core';

import { useNativeAccount } from './useNativeAccount';

export const useSolanaBalance = () => {
  const { account } = useNativeAccount();

  const balance = (account?.lamports || 0) / web3.LAMPORTS_PER_SOL;

  return { balance };
};
