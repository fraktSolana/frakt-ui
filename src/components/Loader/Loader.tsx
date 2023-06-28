import { FC } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { LoaderCircle } from '@frakt/icons';

interface LoaderProps {
  size?: 'large' | 'default' | 'small';
  className?: string;
}

export const Loader: FC<LoaderProps> = ({ size = 'default', className }) => {
  return (
    <LoaderCircle
      className={classNames([
        className,
        styles.loader,
        { [styles.small]: size === 'small' },
        { [styles.large]: size === 'large' },
      ])}
    />
  );
};

export const ModalLoader: FC<LoaderProps> = ({ className }) => {
  return <div className={classNames(styles.load, className)}></div>;
};
