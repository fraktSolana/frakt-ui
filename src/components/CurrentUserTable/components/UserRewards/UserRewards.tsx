import { FC } from 'react';

import { useFetchUserRewards } from './hooks';
import { useWallet } from '@solana/wallet-adapter-react';

const UserRewards: FC = () => {
  const { publicKey } = useWallet();

  const { data: userRewards } = useFetchUserRewards({
    walletPublicKey: publicKey,
  });

  return <div>UserRewards</div>;
};

export default UserRewards;
