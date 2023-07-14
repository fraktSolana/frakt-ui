import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useUserInfo } from '@frakt/hooks';
import { SignOut, ChangeWallet, Copy, FRKT } from '@frakt/icons';
import { UserAvatar } from '@frakt/components/UserAvatar';
import Checkbox from '@frakt/components/Checkbox';
import { copyToClipboard } from '@frakt/utils';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { useIsLedger } from '@frakt/store';
import { useNativeAccount } from '@frakt/utils/accounts';

import styles from './WalletModal.module.scss';
import { useFetchUserRewards } from './hooks';
import { formatSolUserBalance, getUserRewardsValue } from './helpers';

interface UserInfoProps {
  setChangeWallet: (nextValue: boolean) => void;
}

export const UserInfo: FC<UserInfoProps> = ({ setChangeWallet }) => {
  const { disconnect, publicKey } = useWallet();

  if (!publicKey) return null;

  return (
    <div className={styles.userInfo}>
      <UserGeneralInfo />
      <UserBalance />

      <div className={styles.separateLine} />

      <div className={styles.buttonsWrapper}>
        <div className={styles.button} onClick={() => setChangeWallet(true)}>
          <ChangeWallet />
          Change wallet
        </div>
        <div className={styles.button} onClick={disconnect}>
          <SignOut />
          Sign out
        </div>
      </div>
    </div>
  );
};

const UserGeneralInfo: FC = () => {
  const { publicKey } = useWallet();
  const { data } = useUserInfo();

  const { isLedger, setIsLedger } = useIsLedger();

  return (
    <div className={styles.userGeneralInfo}>
      <UserAvatar className={styles.avatar} imageUrl={data?.avatarUrl} />
      <div
        className={styles.userAddress}
        onClick={() => copyToClipboard(publicKey?.toBase58())}
      >
        <p>{shortenAddress(`${publicKey || ''}`)}</p>
        <Copy />
      </div>
      <Checkbox
        onChange={() => setIsLedger(!isLedger)}
        label="I use ledger"
        checked={isLedger}
        className={styles.ledgerCheckbox}
      />
    </div>
  );
};

const UserBalance: FC = () => {
  const { publicKey } = useWallet();

  const { data } = useFetchUserRewards({ walletPublicKey: publicKey });
  const userRewardsValue = getUserRewardsValue(data);

  const { account } = useNativeAccount();
  const solUserValue = formatSolUserBalance(account);

  return (
    <div className={styles.userBalance}>
      <div className={styles.userBalanceColumn}>
        <p>Balance</p>
        <p>{solUserValue}◎</p>
      </div>
      <div className={styles.userBalanceColumn}>
        <p>Rewards</p>
        <p>
          {userRewardsValue || '--'} <FRKT />
        </p>
      </div>
    </div>
  );
};
