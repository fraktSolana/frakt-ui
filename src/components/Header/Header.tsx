import { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

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
  );
};

export const FraktlistingBtn: FC = () => {
  return (
    <a
      className={styles.fraktlistingBtn}
      href={process.env.FRAKTLISTING_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <StarFill />
      <span>Get Fraktlisted!</span>
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
          className={styles.place}
          href={process.env.LEADERBOARD_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {data?.rank ? getNumberWithOrdinal(data?.rank) : '--'}
        </a>
        <div className={styles.pointsWrapper}>
          <div className={styles.points}>
            {data?.points ? points : '--'} pts
          </div>
          <div
            className={classNames(styles.loyalty, {
              [styles.green]: data?.loyaltyBoost > 1,
            })}
          >
            <Triangle
              className={classNames({
                [styles.green]: data?.loyaltyBoost > 1,
              })}
            />
            {data?.loyaltyBoost ? `${data?.loyaltyBoost}x` : '--'} loyalty
          </div>
        </div>
      </div>
    </div>
  );
};
