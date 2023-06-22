import { FC } from 'react';
import Switch from 'react-switch';
import classNames from 'classnames';

import { Sun, Moon } from '@frakt/icons';
import { Theme, useTheme } from '@frakt/hooks/useTheme';

import styles from './styles.module.scss';

export const ThemeSwitcher: FC = () => {
  const { theme, toggleTheme } = useTheme();

  const checked = theme === Theme.DARK;

  return (
    <Switch
      width={64}
      className={classNames(styles.switch, checked && styles.checkedValue)}
      onChange={toggleTheme}
      checked={checked}
      offColor={'#fff'}
      offHandleColor={'#fff'}
      uncheckedHandleIcon={<Sun />}
      checkedHandleIcon={<Moon />}
    />
  );
};
