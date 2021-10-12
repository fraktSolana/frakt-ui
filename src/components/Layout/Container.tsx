import React from 'react';

import styles from './styles.module.scss';

interface ContainerProps {
  component: string;
  className?: string;
  children: JSX.Element[] | JSX.Element;
}

export const Container = ({
  component = 'div',
  className = '',
  children,
}: ContainerProps): JSX.Element => {
  return React.createElement(
    component,
    { className: `${styles.container} ${className}` },
    children,
  );
};
