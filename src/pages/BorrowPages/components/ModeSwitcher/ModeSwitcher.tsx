import { FC } from 'react';

import { BorrowMode } from '@frakt/pages/BorrowPages/types';

import styles from './ModeSwitcher.module.scss';

interface ModeSwitcherProps {
  value: BorrowMode;
  onClick?: () => void;
}

export const ModeSwitcher: FC<ModeSwitcherProps> = ({ value, onClick }) => {
  const isProMode = value === BorrowMode.PRO;

  return (
    <label className={styles.switcher} onClick={onClick}>
      <input className={styles.input} type="checkbox" checked={isProMode} />
      <div className={styles.modesWrapper}>
        <span>{BorrowMode.LITE}</span>
        <span>{BorrowMode.PRO}</span>
      </div>
    </label>
  );
};
