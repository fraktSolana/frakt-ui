import { NavLink } from 'react-router-dom';

import styles from './styles.module.scss';
import { URLS } from '../../constants';
import { Container } from '../Layout';
import { useWallet } from '../../external/contexts/wallet';
import { shortenAddress } from '../../external/utils/utils';

const Header = (): JSX.Element => {
  const { select, wallet, connected } = useWallet();
  return (
    <header className={styles.root}>
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={URLS.ROOT}>
          Fraktion
        </NavLink>
        <ul className={`${styles.navigation} ${styles.navigation_left}`}>
          <li>
            <NavigationLink to={URLS.VAULTS}>Vaults</NavigationLink>
          </li>
          <li>
            <NavigationLink to={URLS.EXCHANGE}>Exchange</NavigationLink>
          </li>
        </ul>
        <ul className={styles.navigation}>
          <li>
            <NavigationLink to={URLS.STAKER_PAGE}>Frakt Staker?</NavigationLink>
          </li>
          <li className={styles.bgAccent}>
            <NavigationLink to={URLS.FRAKTIONALIZE}>
              Fraktionalize
            </NavigationLink>
          </li>
          <li>
            {connected ? (
              <button className={styles.link}>
                {shortenAddress(wallet.publicKey.toString())}
              </button>
            ) : (
              <button className={styles.link} onClick={select}>
                Connect wallet
              </button>
            )}
          </li>
        </ul>
      </Container>
    </header>
  );
};

const NavigationLink = ({ to, children }): JSX.Element => {
  return (
    <NavLink
      to={to}
      className={styles.link}
      activeClassName={styles.activeLink}
    >
      {children}
    </NavLink>
  );
};

export default Header;
