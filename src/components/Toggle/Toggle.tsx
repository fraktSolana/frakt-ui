import { FC } from 'react';
import classNames from 'classnames';

import styles from './Toggle.module.scss';

interface ToggleProps {
  className?: string;
  innerClassName?: string;
  disabled?: boolean;
  value?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
}

const Toggle: FC<ToggleProps> = ({
  className = '',
  innerClassName = '',
  disabled = false,
  onChange = () => {},
  value,
  label = null,
  defaultChecked,
}) => {
  const isControlled = typeof value === 'boolean';

  return (
    <label
      className={classNames(
        styles.root,
        { [styles.rootDisabled]: disabled },
        className,
      )}
    >
      <input
        type="checkbox"
        className={styles.input}
        defaultChecked={defaultChecked}
        checked={isControlled ? value : undefined}
        disabled={disabled}
        onChange={(event) => {
          onChange(isControlled ? !value : event.target.checked);
        }}
      />
      <span className={classNames(styles.slider, innerClassName)} />
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export default Toggle;
