import { FC } from 'react';

import ThemeSwitcher from '../ThemeSwitcher';
import styles from './BurgerMenu.module.scss';
import {
  NAVIGATION_LINKS,
  MenuItem,
  SECONDARY_NAVIGATION_LINKS,
  COMMUNITY_LINKS,
  DOCUMENTATIONS_LINKS,
} from '@frakt/components/Navigation';
import { Theme, useTheme } from '@frakt/hooks/useTheme';

import { useBurgerMenu } from './hooks';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ className = '' }) => {
  const { isVisible, toggleVisibility } = useBurgerMenu();

  const { theme } = useTheme();

  const isDark = theme === Theme.DARK;

  return (
    <>
      <div
        className={`${styles.burgerIcon} ${
          isVisible ? styles.opened : ''
        } ${className}`}
        onClick={toggleVisibility}
      >
        <div className={styles.centerIconLine} />
      </div>
      <div
        className={`${styles.wrapper} ${
          !isVisible ? styles.menuOverlayHidden : ''
        }`}
        onClick={toggleVisibility}
      >
        <ul className={styles.navigation}>
          {[...NAVIGATION_LINKS, ...SECONDARY_NAVIGATION_LINKS].map(
            (item, idx) => (
              <MenuItem
                key={`${item?.label}${idx}`}
                label={item?.label}
                to={item?.to}
                href={item?.href}
                pathname={item?.pathname}
                className={styles.link}
              />
            ),
          )}
        </ul>
        <div className={styles.community}>
          <p className={styles.subtitle}>Community</p>
          <div className={styles.icons}>
            {COMMUNITY_LINKS.map(({ icon, iconDark, href }, idx) => (
              <a
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                href={href}
              >
                {isDark ? iconDark(null) : icon(null)}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.documentation}>
          <p className={styles.subtitle}>Documentation</p>
          <div className={styles.icons}>
            {DOCUMENTATIONS_LINKS.map(({ icon, iconDark, href }, idx) => (
              <a
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                href={href}
              >
                {isDark ? iconDark(null) : icon(null)}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.switcher}>
          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
