import React, { FC } from 'react';
import styles from '../styles.module.scss';
import classNames from 'classnames/bind';
import { URLS } from '../../../constants';
import NavigationLink from '../NavigationLink';
import { useWallet } from '@solana/wallet-adapter-react';

interface AppNavigation {
  className?: string;
}

export const AppNavigation: FC<AppNavigation> = ({ className }) => {
  const { connected, publicKey } = useWallet();

  return (
    <ul
      className={classNames(
        styles.navigation,
        styles.navigation_left,
        className,
      )}
    >
      <li>
        <NavigationLink to={URLS.MARKET}>Market</NavigationLink>
      </li>
      <li>
        <NavigationLink to={URLS.VAULTS}>Vaults</NavigationLink>
      </li>
      <li>
        <NavigationLink to={URLS.SWAP}>Swap</NavigationLink>
      </li>
      <li>
        <a
          className={styles.link}
          href={URLS.DEX}
          target="_blank"
          rel="noopener noreferrer"
        >
          Trade
        </a>
      </li>
      <li>
        <NavigationLink to={URLS.COLLECTIONS}>Collections</NavigationLink>
      </li>
      {connected && (
        <li>
          <NavigationLink
            to={`${URLS.WALLET}/${publicKey.toString()}`}
            isActive={(_, location) =>
              location?.pathname?.includes(publicKey.toString()) || false
            }
          >
            My collection
          </NavigationLink>
        </li>
      )}
    </ul>
  );
};
