import classNames from 'classnames';

import styles from './DropdownBackdrop.module.scss';

export const DropdownBackdrop = ({ visible, children }) => (
  <div
    className={classNames(styles.sortModalMobile, {
      [styles.sortModalMobileVisible]: visible,
    })}
  >
    <div className={styles.sortModalMobileBody}>{children}</div>
  </div>
);
