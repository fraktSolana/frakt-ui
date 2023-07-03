import { CSSProperties, FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface IButtonRegularProps {
  className?: string;
  disabled?: boolean;
  isLink?: boolean;
  linkAttrs?: any;
  onClick?: (args: any) => any;
  children: any;
  type?: 'primary' | 'secondary' | 'tertiary';
  style?: CSSProperties;
}

const Button: FC<IButtonRegularProps> = ({
  className,
  disabled = false,
  isLink = false,
  linkAttrs,
  onClick = () => {},
  type = 'primary',
  style,
  children,
}) => {
  if (isLink) {
    return (
      <Link
        className={classNames([
          styles.root,
          styles.link,
          className,
          styles[type],
        ])}
        {...linkAttrs}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      type="button"
      className={classNames([styles.root, styles[type], className])}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
