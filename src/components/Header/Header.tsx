import { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import TopNotification from '@frakt/components/TopNotification';
import ConnectButton from '@frakt/components/ConnectButton';
import WalletContent from '@frakt/components/WalletContent';
import ThemeSwitcher from '@frakt/components/ThemeSwitcher';
import BurgerMenu from '@frakt/components/BurgerMenu';
import { NotificationsButton } from '@frakt/components/NotificationsButton';
import { getNumberWithOrdinal } from '@frakt/utils';
import { LeaderBoard } from '@frakt/api/user';
import { Logo, LogoFull, StarFill, Triangle } from '@frakt/icons';
import { selectWalletModalVisible } from '../../state/common/selectors';
import { useFetchUserIndividual } from './hooks';
import styles from './Header.module.scss';

export const Header: FC = () => {
  const visible = useSelector(selectWalletModalVisible);
  const { connected } = useWallet();
  const { data } = useFetchUserIndividual();

  return (
    <div className={styles.container}>
      <TopNotification />
      <div className={styles.header}>
        {visible && <WalletContent />}
        <a href={process.env.FRAKT_LANDING_URL} className={styles.logoWrapper}>
          <LogoFull className={classNames(styles.logo, styles.logoFull)} />
          <Logo className={styles.logoBasic} />
        </a>
        <div className={styles.widgetContainer}>
          {!data ? <FraktlistingBtn /> : <FraktlistingStatus data={data} />}

          <div className={styles.switcherContainer}>
            <ThemeSwitcher />
          </div>
          {connected && <NotificationsButton />}
          <ConnectButton className={styles.walletBtn} />
        </div>
        <BurgerMenu />
      </div>
    </div>
  );
};

export const FraktlistingBtn: FC = () => {
  return (
    <a
      href={process.env.FRAKTLISTING_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className={styles.fraktlistingBtn}>
        <StarFill />
        <span>Get Fraktlisted!</span>
      </div>
    </a>
  );
};

export const FraktlistingStatus: FC<{ data: LeaderBoard }> = ({ data }) => {
  const points = Math.trunc(data?.points).toLocaleString();

  return (
    <div className={styles.fraktlistingStatus}>
      <div className={styles.rewards}>
        <span>Season 1</span>
        <span>Leaderboard</span>
      </div>
      <div className={styles.statusWrapper}>
        <a
          href={process.env.LEADERBOARD_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className={styles.place}>
            {data?.rank ? getNumberWithOrdinal(data?.rank) : '00'}
            {data?.rank && <Triangle />}
          </div>
        </a>
        <div className={styles.pointsWrapper}>
          <div className={styles.points}>{data?.points ? points : '0'} pts</div>
          <div
            className={classNames(styles.loyalty, {
              [styles.green]: data?.loyaltyBoost > 1,
            })}
          >
            {data?.loyaltyBoost ? `${data?.loyaltyBoost}x` : '0'} loyalty
          </div>
        </div>
      </div>
    </div>
  );
};
