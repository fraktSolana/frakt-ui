import { FC } from 'react';
import { compose, split, nth, tail } from 'ramda';
import { isString, isFunction } from 'lodash';
import classNames from 'classnames';

import { Theme, useTheme } from '@frakt/hooks/useTheme';
import {
  createNavigationLink,
  createNavigationsLinks,
} from './NavigationComponents';
import {
  NAVIGATION_LINKS,
  SECONDARY_NAVIGATION_LINKS,
  COMMUNITY_LINKS,
  DOCUMENTATIONS_LINKS,
} from './constants';

import styles from './styles.module.scss';

interface MenuItem {
  label: string;
  icon?: any;
  iconDark?: any;
  className?: string;
  event?: string;
  to?: string | ((param: string) => string);
  pathname?: string;
  props?: any;
  href?: string;
  primary?: boolean;
}

export const MenuItem: FC<MenuItem> = ({
  icon: rawIcon,
  iconDark,
  pathname = '',
  href,
  label,
  className,
  primary,
  to,
}) => {
  const { theme } = useTheme();
  const icon = theme === Theme.DARK ? iconDark : rawIcon;

  const isActive =
    compose(nth(1), split('/'))(location.pathname) === tail(pathname);

  const navigationParams = { icon, label, className, to, isActive, primary };

  if (isString(to)) {
    return createNavigationLink(navigationParams);
  } else if (isFunction(to)) {
    return null;
  }

  return (
    <a
      className={classNames(styles.link, className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {icon && icon()}
      {label && <span className={styles.label}>{label}</span>}
    </a>
  );
};

export const Navigation: FC = () => {
  return (
    <div className={styles.container}>
      {createNavigationsLinks({ options: NAVIGATION_LINKS })}
      {createNavigationsLinks({ options: SECONDARY_NAVIGATION_LINKS })}
      {createNavigationsLinks({ options: COMMUNITY_LINKS })}
      {createNavigationsLinks({ options: DOCUMENTATIONS_LINKS })}
    </div>
  );
};
