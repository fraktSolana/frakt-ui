import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { SignOut, ChangeWallet } from '@frakt/icons';

import { WalletsItems } from '../WalletContent/WalletContent';
import UserBalanceInfo from './components/UserBalanceInfo';
import GeneralUserInfo from './components/GeneralUserInfo';

import styles from './styles.module.scss';

const CurrentUserTable: FC<{ className: string }> = ({ className }) => {
  const { disconnect, publicKey } = useWallet();

  if (!publicKey) return null;

  const [visibleWalletItems, setVisibleWalletItems] = useState<boolean>(false);

  return (
    <>
      {!visibleWalletItems ? (
        <div className={classNames(styles.wrapper, className)}>
          <GeneralUserInfo />
          <UserBalanceInfo />

          <div className={styles.separateLine} />

          <div className={styles.buttonWrapper}>
            <div
              className={styles.button}
              onClick={() => setVisibleWalletItems(true)}
            >
              <ChangeWallet />
              Change wallet
            </div>
            <div className={styles.button} onClick={disconnect}>
              <SignOut />
              Sign out
            </div>
          </div>
        </div>
      ) : (
        <WalletsItems />
      )}
    </>
  );
};

export default CurrentUserTable;
