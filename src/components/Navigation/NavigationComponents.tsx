import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { MenuItem } from './Navigation';
import { Navigation } from './types';

import styles from './styles.module.scss';

export const createNavigationsLinks = ({
  options = [],
}: {
  options: Navigation[];
}) => (
  <div className={styles.navigation}>
    {options.map((items, idx) => (
      <MenuItem key={`${items?.pathname}${idx}`} {...items} />
    ))}
  </div>
);

export const createNavigationLink = ({
  icon,
  label,
  className,
  to,
  isActive,
  param,
  primary,
}: {
  icon: any;
  label: string;
  className: string;
  to: any;
  isActive: boolean;
  param?: string;
  primary?: boolean;
}) => {
  return (
    <NavLink
      to={param ? to(param) : to}
      className={classNames(styles.link, className, {
        [styles.active]: isActive,
        [styles.primary]: primary,
        [styles.secondary]: !icon,
        [styles.strategies]: label === 'Strategies',
      })}
    >
      {icon && icon()}
      {label && <span className={styles.label}>{label}</span>}
    </NavLink>
  );
};
