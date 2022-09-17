import { useSelector } from 'react-redux';
import { compose, split, nth, tail } from 'ramda';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import Icons from '../../iconsNew/';
import styles from './styles.module.scss';
import { NAVIGATION_LINKS, community, documentation } from './constants';

interface MenuItem {
  label: string;
  icon?: any;
  className?: string;
  event?: string;
  selector?: any;
  to?: string | ((param: string) => string);
  pathname?: string;
  props?: any;
}

export const MenuItem = ({
  label,
  className,
  icon,
  to,
  selector,
  pathname = '',
}: MenuItem) => {
  console.log(pathname);
  const isActive =
    compose(nth(1), split('/'))(location.pathname) === tail(pathname);

  if (typeof to === 'string') {
    return (
      <NavLink
        to={to}
        className={cx(styles.link, className, { [styles.active]: isActive })}
      >
        {icon && <span className={styles.icon}>{icon()}</span>}
        {label && <span className={styles.label}>{label}</span>}
      </NavLink>
    );
  } else if (typeof to === 'function') {
    const param: string = useSelector(selector);
    if (param) {
      return (
        <NavLink
          to={to(param)}
          className={cx(styles.link, className, { [styles.active]: isActive })}
        >
          {icon && <span className={styles.icon}>{icon()}</span>}
          {label && <span className={styles.label}>{label}</span>}
        </NavLink>
      );
    } else {
      return null;
    }
  }
  return (
    <div className={cx(styles.link, className)}>
      {icon && <span className={styles.icon}>{icon()}</span>}
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export const Navigation = ({
  onClose,
  close,
}: {
  onClose?: () => void;
  close?: boolean;
}) => {
  return (
    <div className={cx(styles.container, close && styles.closeContainer)}>
      <div className={styles.navigation}>
        <div
          className={cx(styles.burger, close && styles.burgerClose)}
          onClick={onClose}
        >
          {close ? <Icons.BurgerClosed /> : <Icons.BurgerOpen />}
        </div>

        {NAVIGATION_LINKS.map((item) => (
          <MenuItem
            label={!close && item.label}
            key={item.label}
            to={item.to}
            icon={(item as any).icon}
            pathname={item.pathname}
            selector={item.selector}
          />
        ))}
      </div>
      <div className={styles.community}>
        {!close && <div className={styles.section}>Community</div>}
        {community.map((item) => (
          <MenuItem
            label={!close && item.label}
            icon={item.icon}
            key={item.label}
          />
        ))}
      </div>
      <div className={styles.documentation}>
        {!close && <div className={styles.section}>Documentation</div>}
        {documentation.map((item) => (
          <MenuItem
            label={!close && item.label}
            icon={item.icon}
            key={item.label}
          />
        ))}
      </div>
    </div>
  );
};
