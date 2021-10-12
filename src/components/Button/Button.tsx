import styles from './styles.module.scss';
import classNames from 'classnames/bind';

interface IButtonRegularProps {
  className?: string;
  disabled?: boolean;
  isLink?: boolean;
  linkAttrs?: any;
  onClick?: (args: any) => any;
  size?: string;
  Icon?: any;
  children: any;
  type?: 'primary' | 'secondary';
}

const getIcon = ({ Icon }) => {
  return Icon ? <Icon size={14} /> : '';
};

const ButtonRegular = ({
  className,
  disabled = false,
  isLink = false,
  linkAttrs,
  onClick = () => {},
  size = 'md',
  type = 'primary',
  Icon,
  children,
}: IButtonRegularProps): JSX.Element => {
  if (isLink) {
    return (
      <a
        className={`${styles.root} ${className || ''} ${
          disabled ? styles.disabled : ''
        } ${styles[size]}`}
        {...linkAttrs}
      >
        {getIcon({ Icon })}
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classNames([
        styles.root,
        className,
        { [styles.disabled]: disabled },
        styles[size],
        styles[type],
      ])}
      onClick={onClick}
    >
      {getIcon({ Icon })}
      {children}
    </button>
  );
};

export default ButtonRegular;
