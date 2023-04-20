import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useNativeAccount } from '@frakt/utils/accounts';
import { FRKT, Solana } from '@frakt/icons';

import { formatSolUserBalance, getUserRewardsValue } from './helpers';
import { useFetchUserRewards } from './hooks';

import styles from './UserBalanceInfo.module.scss';

const UserBalanceInfo: FC = () => (
  <div className={styles.wrapper}>
    <UserBalanceSol />
    <UserRewards />
  </div>
);

export default UserBalanceInfo;

const UserRewards: FC = () => {
  const { publicKey } = useWallet();

  const { data } = useFetchUserRewards({ walletPublicKey: publicKey });

  const userRewardsValue = getUserRewardsValue(data);

  return (
    <div className={styles.column}>
      <p className={styles.title}>Rewards</p>
      <p className={styles.value}>
        {userRewardsValue || '--'} <FRKT />
      </p>
    </div>
  );
};

const UserBalanceSol: FC = () => {
  const { account } = useNativeAccount();

  const solUserValue = formatSolUserBalance(account);

  return (
    <div className={styles.column}>
      <p className={styles.title}>Balance</p>
      <p className={styles.value}>
        {solUserValue} <Solana />
      </p>
    </div>
  );
};
