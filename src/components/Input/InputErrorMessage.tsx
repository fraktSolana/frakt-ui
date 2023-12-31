import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface InputErrorMessageProps {
  className?: string;
  message: string;
  hasError: boolean;
}

export const InputErrorMessage: FC<InputErrorMessageProps> = ({
  className,
  message,
  hasError,
}) => {
  const containerClassName = classNames(styles.errors, className);
  const errorMessage = hasError ? message : '';

  return (
    <div className={containerClassName}>
      <p>{errorMessage}</p>
    </div>
  );
};
