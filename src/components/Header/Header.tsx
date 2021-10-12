import { NavLink } from 'react-router-dom';

import styles from './styles.module.scss';
import { URLS } from '../../constants';
import { Container } from '../Layout';

const Header = (): JSX.Element => {
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
            <button
              className={styles.link}
              onClick={() => alert('Connect wallet modal here')}
            >
              Connect wallet
            </button>
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
