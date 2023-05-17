import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectWalletModalVisible } from '../../state/common/selectors';
import ConnectButton from '@frakt/components/ConnectButton';
import WalletContent from '@frakt/components/WalletContent';
import ThemeSwitcher from '@frakt/components/ThemeSwitcher';
import BurgerMenu from '@frakt/components/BurgerMenu';
import { NotificationsButton } from '@frakt/components/NotificationsButton';
import { Logo, LogoFull, StarFill } from '@frakt/icons';
import styles from './Header.module.scss';
import { LeaderBoard, useFetchUserIndividual } from './hooks';
import { getNumberWithOrdinal } from '@frakt/utils';
import classNames from 'classnames';

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
  const goToFraktlisting = () => {
    window.open('https://fraktlisting.frakt.xyz/', '_blank');
  };
  return (
    <button className={styles.fraktlistingBtn} onClick={goToFraktlisting}>
      <StarFill />
      <span>Get Fraktlisted!</span>
    </button>
  );
};

export const FraktlistingStatus: FC<{ data: LeaderBoard }> = ({ data }) => {
  return (
    <div className={styles.fraktlistingStatus}>
      <div className={styles.rewards}>
        <span>Rewards S1</span>
        <span>Fraktlisting</span>
      </div>
      <div className={styles.statusWrapper}>
        <div className={styles.place}>
          {data?.rank ? getNumberWithOrdinal(data?.rank) : '--'}
        </div>
        <div className={styles.pointsWrapper}>
          <div className={styles.points}>
            {data?.points ? Math.trunc(data?.points).toLocaleString() : '--'}{' '}
            pts
          </div>
          <div
            className={classNames(styles.loyalty, {
              [styles.green]: data?.loyaltyBoost > 1,
            })}
          >
            {data?.loyaltyBoost ? data?.loyaltyBoost : '--'} loyalty
          </div>
        </div>
      </div>
    </div>
  );
};
