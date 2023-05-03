import { FC } from 'react';
import { compose, split, nth, tail } from 'ramda';
import { isString, isFunction } from 'lodash';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { selectTheme } from '@frakt/state/theme/selectors';
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
  selector?: any;
  to?: string | ((param: string) => string);
  pathname?: string;
  props?: any;
  href?: string;
  primary?: boolean;
}

export const MenuItem: FC<MenuItem> = ({
  label,
  className,
  icon: rawIcon,
  iconDark,
  to,
  selector,
  pathname = '',
  href,
  primary,
}) => {
  const theme = useSelector(selectTheme);
  const icon = theme === 'dark' ? iconDark : rawIcon;

  const isActive =
    compose(nth(1), split('/'))(location.pathname) === tail(pathname);

  const navigationParams = { icon, label, className, to, isActive, primary };

  if (isString(to)) {
    return createNavigationLink(navigationParams);
  } else if (isFunction(to)) {
    const param: string = useSelector(selector);

    if (param) createNavigationLink({ ...navigationParams, param });
    else return null;
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
