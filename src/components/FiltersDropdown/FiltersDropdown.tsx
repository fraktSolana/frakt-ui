import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './FiltersDropdown.module.scss';

interface FiltersDropdownProps {
  children: ReactNode;
  className?: string;
  onCancel?: () => void;
}

const FiltersDropdown: FC<FiltersDropdownProps> = ({ children, className }) => (
  <div className={classNames(styles.wrapper, className)}>{children}</div>
);

export default FiltersDropdown;
