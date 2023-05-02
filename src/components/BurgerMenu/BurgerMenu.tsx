import { FC } from 'react';
import { useSelector } from 'react-redux';

import ThemeSwitcher from '../ThemeSwitcher';
import styles from './BurgerMenu.module.scss';
import {
  community,
  documentation,
  NAVIGATION_LINKS,
  MenuItem,
  SECONDARY_NAVIGATION_LINKS,
} from '@frakt/components/Navigation';
import { selectTheme } from '../../state/theme/selectors';
import { useBurgerMenu } from './hooks';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ className = '' }) => {
  const { isVisible, toggleVisibility } = useBurgerMenu();

  const theme: string = useSelector(selectTheme);

  const isDark = theme === 'dark';

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
          {[...NAVIGATION_LINKS, ...SECONDARY_NAVIGATION_LINKS].map((item) => (
            <MenuItem
              key={item?.label}
              label={item?.label}
              to={item?.to}
              href={item?.href}
              pathname={item?.pathname}
              className={styles.link}
            />
          ))}
        </ul>
        <div className={styles.community}>
          <p className={styles.subtitle}>Community</p>
          <div className={styles.icons}>
            {community.map(({ icon, iconDark, href }, idx) => (
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
            {documentation.map(({ icon, iconDark, href }, idx) => (
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
